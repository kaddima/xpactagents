<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    public function getUserAccount(Request $request){

        $user_id = auth()->user()->id;

        //if accessed from admin page...specific user data
        $id = @$request->get('user_id');


        $user = DB::table('users')
            ->where(['id'=>isset($id)?$id:$user_id])
            ->first();

        if(isset($id)){

            return json_encode(['data'=>
                [
                'user'=>$user
                ]
            ]);
        }

        return json_encode(['data'=>
            [

                'user'=>$user

            ]
        ]);
    }

    /**This returns users, agents and other data onc the application loads */
    public function getGeneralDataAgent(){

        $admin_id = auth()->user()['id'];

        //get all Admins
        $users = DB::table('users')
        ->get();

        //get all agents
        $agents = DB::table('agents')
        ->get();

        //get all agents
        $appointments = DB::table('appointments')
        ->where('resolved','0')
        ->limit(12)
        ->get();

        //get count for rent,land,house for sell,short-let
        $forSellCount  = DB::table('property')
            ->where('category', 'sell')
            ->count();

        $rentCount  = DB::table('property')
        ->where('category', 'rent')
        ->count();

        $landCount  = DB::table('property')
        ->where('category', 'land')
        ->count();

        $short_letCount  = DB::table('property')
        ->where('category', 'short_let')
        ->count();

        $propertyCount  = DB::table('property')
        ->count();

        return json_encode([
            'status'=>1,
            'data'=>[
                'users'=>$users,
                'agents'=>$agents,
                'agentsCount'=>count($agents),
                'forSellCount'=>$forSellCount,
                'rentCount'=>$rentCount,
                'landCount'=>$landCount,
                'shortLetCount'=>$short_letCount,
                'propertyCount'=>$propertyCount,
                'appointments'=>$appointments

            ]
        ]);

    }

    public function generalAgentData(){

        if(auth()->check()){

            $agent_id = auth()->user()['id'];

           $profile = User::find($agent_id);

           $obj = new \stdClass();

            //get count for rent,land,house for sell,short-let
            $forSellCount  = DB::table('property')
                ->where(['category'=>'sell','creator_id'=>$agent_id])
                ->count();

            $rentCount  = DB::table('property')
                ->where(['category'=>'rent','creator_id'=>$agent_id])
                ->count();

            $landCount  = DB::table('property')
                ->where(['category'=>'land','creator_id'=>$agent_id])
                ->count();

            $short_letCount  = DB::table('property')
                ->where(['category'=>'short_let','creator_id'=>$agent_id])
                ->count();

            $propertyCount  = DB::table('property')
                ->where(['creator_id'=>$agent_id])
                ->count();
            $unpublishedPropertyCount  = DB::table('property')
                ->where(['creator_id'=>$agent_id,
                'published'=>0])
                ->count();

            $unpublishedProperty = DB::table('property')
                ->where(['creator_id'=>$agent_id,
                        'published'=>0])
                ->limit(3)
                ->get();

            $obj->forSellCount = $forSellCount;
            $obj->rentCount = $rentCount;
            $obj->landCount = $landCount;
            $obj->shortLetCount = $short_letCount;
            $obj->propertyCount = $propertyCount;
            $obj->unpublishedProperty = $unpublishedProperty;
            $obj->unpublishedPropertyCount = $unpublishedPropertyCount;

            return json_encode([
                'status'=>1,
                'data'=>[
                    'profile'=>$profile,
                    'propertyDetails'=>$obj

                ]
            ]);
        }
    }

    public function createAccount(Request $request){

        $data = [];
        $errors = [];
        $status = 1;

        $data = $request->all();

        $email = strtolower($data['email']);
        $email = preg_replace('/(^wwww\.|^www\.|^ww\.)/', '',$email);


        if($data['accountType'] == 'admin'){

            //check if email is already registered
            $result = DB::table('users')
            ->where(['email'=>$email])
            ->first();


            if (isset($result)){
                $status = 0;
                $errors[] = 'Email address is already registered';
            }

            $password = $data['password'];
            $c_password = $data['confirm_password'];

             if ($password !== $c_password){
            $status = 0;
            $errors[] = 'Password does not match';
            }

            if($status){

                //hash password
                $password = password_hash($data['password'], PASSWORD_DEFAULT);

                $columName_values = [
                    'first_name'=>$data['first_name'],
                    'last_name'=>$data['last_name'],
                    'email'=>$email,
                    'password'=>$password,

                ];

                //insert the user data into user database
                $last_id = DB::table('users')
                        ->insertGetId($columName_values);

                //get all users
                $users = DB::table('users')
                    ->get();

                return json_encode([
                    'status'=>$status,
                    'data'=>$users

                ]);
            }

            return json_encode([
            'status'=>$status,
            'errors'=>$errors
              ]);

        }else{

            $columName_values = [
                'first_name'=>$data['first_name'],
                'last_name'=>$data['last_name'],
                'email'=>$email,
                'phone'=>$data['phone'],
                'whatsapp_number'=>$data['whatsapp']

            ];

            DB::table('agents')
                ->insert($columName_values);

            $agents = DB::table('agents')
                ->get();

            return json_encode([
                'status'=>$status,
                'data'=>$agents
                ]);
        }







    }

    public function updateAccount(Request $request){

        $data = $request->all();
        $table = 'users';

        if(isset($data['name']) && ($data['name'] === 'account_number' ||
            $data['name'] === 'savings' || $data['name'] === 'account_type'
            || $data['name'] === 'account_balance')){
            $table = 'accounts';
        }
        else if(isset($data['name']) && ($data['name'] === 'card_number' ||
                $data['name'] === 'cvc'  || $data['name']==='spending_limit' ||
                $data['name']==='spent' || $data['name']==='exp' ||
                $data['name']==='card_balance' || $data['name']==='card_active'))
        {
            $table = 'card';
        }

        if($data['name'] === 'photo'){

            $errors = [];
            $status = 1;
            $photoPattern = '#^(image/)[^\s\n<]+$#i';
            $upload_dir = __DIR__."/../../public/uploads/";

            $file = $request->file('photo');

            $name = $file->getClientOriginalName();
            $size = $file->getSize();
            $target = $upload_dir.$name;

            if ((floatval($size)/1000) > 500){
                $errors[] = 'file too large -- 500kb and below';
                $status = 0;
            }elseif (!preg_match($photoPattern,$file->getMimeType())){
                $errors[] = 'please upload only images';
                $status = 0;
            }elseif (file_exists($target)){
                $errors[] = 'File already exist';
                $status = 0;

            }

            if($status){

                //get the name of the previous photo
                $prevPhoto = DB::table('users')
                ->where(['id'=>$data['user_id']])
                ->first(['photo']);

                //unlink the previous pix
                //unlink(public_path('uploads/'.$prevPhoto->photo));

                // upload the photo to server
                $file->move(public_path('uploads'),$name);

                //update the value
                DB::table('users')
                ->where(['id'=>$data['user_id']])
                ->update(['photo'=>$name]);

                //get the table updated
                $results =  DB::table('users')
                    ->where(['id'=>$data['user_id']])
                    ->first();

                return json_encode(['status'=>1, 'data'=>[
                    'table'=>$table,
                    'data'=>$results
                ]]);

            }else{
                return json_encode(['status'=>$status,
                    'errors'=>$errors

                ]);
            }


            $userphoto = Users::find('users', ['user_id'=>$user_id])['photo'];

            $result = File::UploadPhoto($userPhotoDIR);

            if ($result['valid']){

                //delete the previous pix then save a new one
                unlink($userPhotoDIR.$userphoto);

                DbActions::update('users','user_id',$user_id,['photo'=>$_FILES['file']['name']]);
            }
        }

        //update the value
        DB::table($table)
            ->where([$table=='users'?'id':'user_id'=>$data['user_id']])
            ->update([$data['name']=>$data['value']]);

        //get the table updated
        $results =  DB::table($table)
            ->where([$table=='users'?'id':'user_id'=>$data['user_id']])
            ->first();

        return json_encode(['status'=>1, 'data'=>[
            'table'=>$table,
            'data'=>$results
        ]]);
    }

    public function updateLastSeen(){

        $currentUser = auth()->user();

        $date = date('Y-m-d H:i:s');

        $currentUser->last_seen = $date;

        DB::table('users')
            ->where('id',$currentUser->id)
            ->update(['last_seen'=>$date]);

        return json_encode(['data'=>$currentUser]);
    }

}
