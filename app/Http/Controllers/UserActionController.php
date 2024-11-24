<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\File;

class UserActionController extends Controller
{
    public function store(Request $request){

        $data = $request->all();

        switch ($data['type']){

            case 'update':
                return $this->updateUser($data);
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
        $filename = pathInfo($request->get('file_name'))['filename'].".jpg";

        $file = $request->file('image');

        $error = '';
        $status = 1;

        //directory to upload image
        $upload_dir = public_path('uploads/users/'.$user_id.'/profile-photo/');

        $imageName = $file->getClientOriginalName();
        $size = $file->getSize();
        $target = $upload_dir.$filename;


        if ((floatval($size)/1000) > 700){
            $error = 'file too large -- 700kb and below';
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
            $file->move($upload_dir,$filename);

            //insert the photo to database

            $columnValue = [
                'photo'=>$filename
            ];

            DB::table('users')
                ->where('id',$user_id)
                ->update($columnValue);

            return json_encode(['status'=>$status, 'error'=>$error,'photos'=>$filename]);


        }

        return json_encode(['status'=>$status, 'error'=>$error]);
    }

    public function blockUser(Request $request){

        $user_id = $request->get('user_id');

        $user = DB::table('users')
        ->where(['id'=>$user_id])
        ->first(['id','block','is_agent']);

        if($user->is_agent == 1){

            if ($user->block == 0){
                DB::table('users')
                    ->where(['id'=>$user_id])
                    ->update(['block'=>1]);
                //unpublish agent property
                DB::table('property')
                ->where('creator_id',$user_id)
                ->update(['published'=>0]);
            }else{
    
                DB::table('users')
                    ->where(['id'=>$user_id])
                    ->update(['block'=>0]);

                //publish agents properties    
                DB::table('property')
                ->where('creator_id',$user_id)
                ->update(['published'=>1]);
            }
        }else{

             if ($user->block == 0){
                DB::table('users')
                ->where(['id'=>$user_id])
                ->update(['block'=>1]);
            }else{

                DB::table('users')
                    ->where(['id'=>$user_id])
                    ->update(['block'=>0]);
            }
        }

        return json_encode(['status'=>1]);

    }

    public function deleteUser(Request $request){

        $user_id = $request->get('user_id');

        $user = DB::table('users')
        ->where(['id'=>$user_id])
        ->first(['id','block','is_agent']);

        if($user->is_agent == 1){

            try{
                //directory to upload image
                $upload_dir = public_path('uploads/users/'.$user_id.'/');
                //delete all agent folder containing property images
                File::deleteDirectory($upload_dir);

                //delete the agents messages
                //start with property of interest poi
                $pois = DB::table('property_of_interest')
                    ->where('agent_id',$user_id)
                    ->get();

                 // delete the agents tours
                DB::table('tours')
                ->where('agent_id',$user_id)
                ->delete();

                //delete the agents favorite
                DB::table('favorites')
                    ->where('user_id',$user_id)
                    ->delete();

                // delete the agents properties
                $properties = DB::table('property')
                ->where('creator_id',$user_id)
                ->delete();  

                foreach($pois as $poi){

                    
                    DB::beginTransaction();
                    // DB::transaction(function () {
                            //delete the property from property interestorss table
                        DB::table('property_interestors')
                            ->where('property_id',$poi->property_id)
                            ->delete();
                        
                        //get the conversation id for this property
                        $conversation_id = DB::table('conversations')
                            ->where('property_id',$poi->property_id)
                            ->first('id');
    
                        //delete messages with the conversation id
                        DB::table('messages')
                            ->where('conversation_id',$conversation_id->id)
                            ->delete();
    
                        //delete the conversation with property
                        DB::table('conversations')
                            ->where('property_id',$poi->property_id)
                            ->delete();
    
                    // });
                    
                    
                }
    
                DB::table('property_of_interest')
                    ->where('agent_id',$user_id)
                    ->delete();

                //delete users
                DB::table('users')
                ->where(['id'=>$user_id])
                ->delete();    

                DB::commit();    

            }catch(\Exception $e){

                $error = 'Connection Failed! '.$e->getMessage() .' FILE: '.
                    $e->getFile().' on LINE: '.$e->getLine();
                trigger_error($error, E_USER_ERROR);

                DB::rollBack();
            }

        }else{

            //delete users
             DB::table('users')
            ->where(['id'=>$user_id])
            ->delete();
        }

        

        return json_encode(['status'=>1]);
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

    public function verifyIdentification(Request $request){

        $currentUser = auth()->user();
        $photoPattern = '#^(image/)[^\s\n<]+$#i';

        $file = $request->file('image');

        $error = '';
        $status = 1;

        //directory to upload image
        $upload_dir = public_path('uploads/users/'.$currentUser->id.'/profile-photo/');

        $imageName = str_replace(' ', '-',$file->getClientOriginalName()) ;
        $size = $file->getSize();
        $target = $upload_dir.$imageName;


        if ((floatval($size)/1000) > 700){
            $error = 'file too large -- 700kb and below';
            $status = 0;
        }elseif (!preg_match($photoPattern,$file->getMimeType())){
            $error = 'please upload only images';
            $status = 0;
        }elseif (file_exists($target)){
            $error = 'File already exist';
            $status = 0;

        }

        if($status == 1){

            if($currentUser->id_verified == 0){

                // upload the photo to server
                $file->move($upload_dir,$imageName);

                //update the users id_verify to 2 "pending verification"
                DB::table('users')
                    ->where('id',$currentUser->id)
                    ->update(['id_verified'=>2]);

                //insert the photo to database

                $columnValue = [
                    'user_id'=>$currentUser->id,
                    'image'=>$imageName,
                    'fullname'=>$request->get('fullname'),
                    'doc_type'=>$request->get('doc_type')
                ];

                DB::table('id_verify')
                    ->insert($columnValue);

                return json_encode(['status'=>$status, 'error'=>$error]);

            }

           
        }

        return json_encode(['status'=>$status, 'error'=>$error]);
    }

}
