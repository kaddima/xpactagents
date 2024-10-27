<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserActionController extends Controller
{
    public function store(Request $request){

        $data = $request->all();

        switch ($data['type']){

            case 'update':
                return $this->updateUser($data);
                break;

            case 'block':
               return  $this->blockUser($data);
                break;

            case 'delete':
               return $this->deleteUser($data['user_id']);
                break;

            case 'update_agent':
                return  $this->updateAgent($data);
                    break;

            case 'delete_agent':
                return  $this->deleteAgent($data);
                    break;

            case 'delete_statement':
                return  $this->deleteStatement($data);
                    break;

            default:
                break;
        }
    }


    public function updateUser(Request $request){

        $data = $request->all();

        $user_id = auth()->user()['id'];

        $userModel = User::find($user_id);

        $userModel->first_name = $data['first_name'];
        $userModel->middle_name = $data['middle_name'];
        $userModel->last_name = $data['last_name'];
        $userModel->gender = $data['gender'];
        $userModel->phone = $data['phone'];
        $userModel->whatsapp = $data['whatsapp'];
        $userModel->dob = $data['dob'];
        $userModel->state = $data['state'];
        $userModel->lga = $data['lga'];
        $userModel->address = $data['address'];
        $userModel->profile_complete = 1;


//        DB::table('users')->where(['id'=>$user_id])
//        ->update($column);

        $userModel->save();

        return json_encode(['status'=>1,'data'=>$userModel]);
    }

    public function uploadPhoto(Request $request){

        $user_id = auth()->user()['id'];
        $photoPattern = '#^(image/)[^\s\n<]+$#i';

        $file = $request->file('image');

        $error = '';
        $status = 1;

        //directory to upload image
        $upload_dir = public_path('uploads/users/'.$user_id.'/profile-photo/');

        $imageName = $file->getClientOriginalName();
        $size = $file->getSize();
        $target = $upload_dir.$imageName;


        if ((floatval($size)/1000) > 1500){
            $error = 'file too large -- 1.5Mb and below';
            $status = 0;
        }elseif (!preg_match($photoPattern,$file->getMimeType())){
            $error = 'please upload only images';
            $status = 0;
        }elseif (file_exists($target)){
            $error = 'File already exist';
            $status = 0;

        }

        if($status == 1){

            // upload the photo to server
            $file->move($upload_dir,$imageName);

            //insert the photo to database

            $columnValue = [
                'photo'=>$imageName
            ];

            DB::table('users')
                ->where('id',$user_id)
                ->update($columnValue);

            return json_encode(['status'=>$status, 'error'=>$error,'photos'=>$imageName]);


        }

        return json_encode(['status'=>$status, 'error'=>$error]);
    }

    public function blockUser($data){

        //admin id
        $id = auth()->user()['id'];

        $user = DB::table('users')
        ->where(['id'=>$data['user_id']])
        ->first(['id','block']);

        $user_id = $user->id;

        if ($user->block == 0){
            DB::table('users')
                ->where(['id'=>$user_id])
                ->update(['block'=>1]);
        }else{

            DB::table('users')
                ->where(['id'=>$user_id])
                ->update(['block'=>0]);
        }


        $users = DB::table('users')
            ->where(['creator_id'=>$id])
            ->get();

        return json_encode(['status'=>1, 'data'=>$users]);

    }

    public function deleteUser($user_id){
        //admin id
        $id = auth()->user()['id'];

        //delete users
        DB::table('users')
            ->where(['id'=>$user_id])
            ->delete();

        // get all users belonging to the admin
        $users = DB::table('users')
            ->get();

        return json_encode(['status'=>1, 'data'=>$users]);
    }

    public function creditAccount($data){

        $user_id = $data['user_id'];
        $ref_no = mt_rand(1000000000000000000,9000000000000000000);

        //get the users first and last name
        $user = DB::table('users')
        ->where(['id'=>$user_id])
        ->first(['f_name','l_name','email']);

        //get the user's account details
        $accountDetails = DB::table('accounts')
                ->where(['user_id'=>$user_id])
                ->first();

        //add the credit amount to the account balance
        $new_balance = $data['amount'] + $accountDetails->account_balance;

        $sendersAcct = mt_rand(1000000000,99999999999);


        $date = date('d-M-Y');
        $time = date('h:ia');

        //update the user's account
        DB::table('accounts')
                ->where(['user_id'=>$user_id])
                ->update(['account_balance'=>$new_balance,
                'prev_balance'=>$accountDetails->account_balance]);

        //log the transaction into admin_credit
        // DB::table('admin_credit')
        // ->insert(['admin_id'=>auth()->user()->id,
        //         'account_number'=>$accountDetails->account_number,
        //         'amount'=>$data['amount'],
        //         'sender'=>$data['sender'],
        //         'description'=>$data['description']]);


           // insert the credit transaction into the users transaction
           $column_value = ['user_id'=>$data['user_id'],
           'beneficiary_name'=>$data['sender'],
           'transaction_type'=>'credit',
           'transfer_type'=>'international-transfer',
           'account_number'=>$sendersAcct,
           'account_type'=>'Current',
           'transfer_amount'=>$data['amount'],
           'description'=>$data['description'],
           'otp'=>00,
           'ref_no'=>$ref_no,
           'creator_id'=>auth()->user()->id,
           'balance'=>$new_balance,
           'success'=>1,
           'currency'=>'USD'
       ];

         //log the transaction
          DB::table('transaction')
          ->insert($column_value);

         $message = '
         <div>

            <p>Dear <b>'. $user->f_name.' '.$user->l_name.'</b></p>
            <h4 style="padding-top: 3px; font-weight: bold">Bank Electronic Notification Service</h4>
            <p>We wish to inform you that a Credit Transaction occurred on your account with us</p>

            <h4 style="padding-top: 3px; font-weight: bold">Transaction Notification</h4>

            <div style="width: 90%">
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Account Number </p>
                    <span style="display: inline; width: 50%;">:'. $sendersAcct.'</span>
                </div>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Sender</p>
                    <span style="display: inline; width: 50%;text-transform: capitalize">:'.$data['sender'].'</span>
                </div>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Description</p>
                    <span style="display: inline; width: 50%;">: '.$data['description'].'</span>
                </div>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Amount</p>
                    <span style="display: inline; width: 50%;">: $'.number_format($data['amount']).'</span>
                </div>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Date</p>
                    <span style="display: inline; width: 50%;">:'.$date.'</span>
                </div>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Time</p>
                    <span style="display: inline; width: 50%;">:'. $time.'</span>
                </div>

                <p>The balances on this account are as follows </p>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Current Balance</p>
                    <span style="display: inline; width: 50%;">: $'.number_format($new_balance).'</span>
                </div>
                <div style="width: 100%;">
                    <p style="width: 50%; display: inline-block">Available Balance</p>
                    <span style="display: inline; width: 50%;">: $'.number_format($new_balance).'</span>
                </div>

                <p>Thanks for choosing Fabkuwait Bank</p>
            </div>

        </div>';
        $subject = 'Transaction Alert [Credit:]';

        //send the mail
       //Mailer::sendMail($user->email,$message,$subject);

      //get the updated user account
        $accountDetails = DB::table('accounts')
        ->where(['user_id'=>$user_id])
        ->first();

      return json_encode(['status'=>1,'data'=>[
        'account'=>$accountDetails
      ]]);


    }

    public function userQuestions($data){

        $user_id = $data['user_id'];

        //get all questions to this user
        $questions = DB::table('question')
                ->where(['user_id'=>$user_id])
                ->get();

        return json_encode(['status'=>1, 'data'=>$questions]);
    }

    public function addQuestion($data){

        DB::table('question')
            ->insert(['user_id'=>$data['user_id'],
            'question'=>$data['question'],
            'answer'=>$data['answer']]);

        //return all quqestions

        $questions = DB::table('question')
                ->where(['user_id'=>$data['user_id']])
                ->get();

        return json_encode(['status'=>1,'data'=>$questions]);
    }

    public function updateAgent($data){

        $column_value = ['first_name'=>$data['first_name'],
            'last_name'=>$data['last_name'],
            'phone'=>$data['phone'],
            'email'=>$data['email'],
            'whatsapp_number'=>$data['whatsapp_number']];

        DB::table('agents')
            ->where(['id'=>$data['agent_id']])
            ->update($column_value);

        //return all agents
        $agents = DB::table('agents')
                ->get();

        return json_encode(['status'=>1,'data'=>$agents]);
    }

    public function deleteAgent($data){

        DB::table('agents')
        ->where(['id'=>$data['agent_id']])
        ->delete();

          //return all agents
          $agents = DB::table('agents')
          ->get();

         return json_encode(['status'=>1,'data'=>$agents]);

    }

    public function deleteStatement($data){

        DB::table('transaction')
        ->where(['id'=>$data['id']])
        ->delete();

          //return all quqestions
          $statements = DB::table('transaction')
          ->where(['user_id'=>$data['user_id'],'creator_id'=>auth()->user()->id])
          ->get();

         return json_encode(['status'=>1,'data'=>$statements]);

    }

    public function resolveAppointments(Request $request){

        $appointment_id = $request->get('appointment_id');

        DB::table('appointments')
            ->where('id',$appointment_id)
            ->update(['resolved'=>1]);

        $appointments = DB::table('appointments')
            ->where('resolved',0)
            ->get();

        return json_encode(['data'=>$appointments]);
    }
}
