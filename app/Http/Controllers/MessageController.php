<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/../../../Business/mailer.php';
use Business\Mailer;

class MessageController extends Controller
{

    public function store(Request $request){

        $formData = $request->all();
        $property_id = $formData['property_id'];
        $agent_id = $formData['agent_id'];
        $formMsg = $formData['message'];

        //get the property of interest
        $propertyOfInterest = DB::table('property_of_interest')
            ->where('property_id',$property_id)
            ->first();

        if(!$propertyOfInterest){
            //if not already available create the property of interest
            $propertyOfInterest = DB::table('property_of_interest')
                ->insertGetId([
                    'property_id'=>$property_id,
                    'agent_id'=>$agent_id]);
        }

        $propertyOfInterest = gettype($propertyOfInterest) == 'integer' ? $propertyOfInterest : $propertyOfInterest->id;

        if(!$propertyOfInterest){
            return json_encode(['status'=>'failed']);
        }
    
        //check if the user is logged in
        if(auth()->check()){

            $user_id = auth()->user()['id'];

            /** check property interestors table for this user if the user is present
             * and already interested in the property of interest if the user is
             *  do nothing otherwise add the user 
             */

            DB::table('property_interestors')
                ->updateOrInsert([
                    'property_id'=>$property_id,
                    'user_id'=>$user_id]);
            
            /**
             * Check if there is an active conversation on the property of interest
             * between the user and the property's agent
             */

            $conversation = DB::table('conversations')
                ->where([
                    'user_id'=>$user_id,
                    'agent_id'=>$agent_id,
                    'property_id'=>$property_id
                ])
                ->first();

            if(!$conversation){

                $conversation = DB::table('conversations')
                    ->insertGetId([
                        'user_id'=>$user_id,
                        'agent_id'=>$agent_id,
                        'property_id'=>$property_id
                    ]);
            }
            //get the id of the conversation
            $conversation = gettype($conversation) == 'integer' ? $conversation : $conversation->id;
                
            // add the message to the message table
            DB::table('messages')
                ->insert([
                    'conversation_id'=>$conversation,
                    'property_of_interest_id'=>$property_id,
                    'sender_id'=>$user_id,
                    'body'=>$formMsg,
                    'created_at'=>date('Y-m-d H:i:s')

                ]);


            return json_encode(['status'=>1,'data'=>$user_id]);

        }else{

            // check if email is already taken
            $user = DB::table('users')
                ->where('email',$formData['email'])
                ->first();

            if($user){

                return json_encode(['status'=>0,'error'=>'Email address is already taken']);
            }

            //create the user and get id
            $newUser = new User();
            $newUser->first_name = $formData['first_name'];
            $newUser->last_name = $formData['last_name'];
            $newUser->email =  preg_replace('/(^wwww\.|^www\.|^ww\.)/', '',$formData['email']);
            $newUser->phone = $formData['phone'];
            //create password first_name + 2023
            $newUser->password = $formData['first_name'].'2023';
            $newUser->save();

            $user_id = $newUser->id;

            // add user to property interestors table
            DB::table('property_interestors')
                ->updateOrInsert([
                    'property_id'=>$property_id,
                    'user_id'=>$user_id]);

            //create a new conversation
            $conversation = DB::table('conversations')
                ->insertGetId([
                    'user_id'=>$user_id,
                    'agent_id'=>$agent_id,
                    'property_id'=>$property_id
                ]);

            // add the message to the message table
            DB::table('messages')
                ->insert([
                    'conversation_id'=>$conversation,
                    'property_of_interest_id'=>$property_id,
                    'sender_id'=>$user_id,
                    'body'=>$formData['message'],
                    'created_at'=>date('Y-m-d H:i:s')

                ]);

            // loggin the user
            auth()->login($newUser,true);

            $subject = 'Email Verification';
//            $message = <<<EMAIL
//                <div>
//                     <div style="margin-bottom: 5px;">
//                                    <img src="cid:siteLogo" style="display: block;
//                                                                      margin-left: auto;
//                                                                      margin-right: auto;
//                                                                      width: 70%;">
//                                </div>
//                    <h1 style="text-align: center; font-weight: bold;">Email Verfication Code</h1>
//                    <p>Please click the button below to verify your email address<br>This step is to ensure that your email address
//                            is not used without your consent</p>
//
//                    <a href="$url" style="padding: 5px 10px; border-radius: 5px; background-color: #3f83f8; color: white;font-weight: bold;">click me</a>
//
//               </div>
//EMAIL;

            // Mailer::sendMail($formData['email'],$message,$subject);
            return json_encode(['status'=>1,'data'=>$newUser]);
        }


    }

    public function agentsPropertyOfInterest(Request $request){

        $currentUser = auth()->user();

        //get the agents property conversations

        $property_of_interest = DB::table('property_of_interest')
            ->join('property', 'property_of_interest.property_id','=','property.id')
            ->where('property_of_interest.agent_id',$currentUser->id)
            ->get();

        $data = [
            'property_of_interest'=>$property_of_interest
        ];

        return json_encode(['data'=>$data]);

    }
    public function usersPropertyOfInterest(Request $request){

        $currentUser = auth()->user();

        /**
         * Arrange the data so every property are associated to the agents key
         * ['1'=>[[],[]]]
         */
        $agent_assoc_property = [];

        //get the agents property conversations

        $property_of_interest = DB::table('property_interestors')
            ->join('property', 'property_interestors.property_id','=','property.id')
            ->where('property_interestors.user_id',$currentUser->id)
            ->get();
        
        foreach($property_of_interest as $property){

           $property->conversation_id = DB::table('conversations')
                ->where([
                    'user_id'=>$currentUser->id,
                    'agent_id'=>$property->creator_id,
                    'property_id'=>$property->id])
                ->first('id')->id;

            $property->creatorInfo = DB::table('users')
                ->where('id',$property->creator_id)
                ->first();
        }

        $data = [
            'property_of_interest'=>$property_of_interest
        ];

        return json_encode(['data'=>$data]);

    }

    public function agentsUsersInterested(Request $request){

        //$currentUser = auth()->user()->id;
        $property_of_interest = $request->get('property_of_interest');

        //get the users interested the active property
        $users = DB::table('property_interestors')
            ->where('property_id', $property_of_interest)
            ->get();

        foreach ($users as $u){
            $u->userInfo = DB::table('users')->where('id',$u->user_id)->first();
            $u->conversation = DB::table('conversations')
                ->where(['user_id'=>$u->user_id,
                    'property_id'=>$property_of_interest])
                ->first(['id']);

            if($u->conversation){
                $u->unreadCount = DB::table('messages')
                    ->where([
                        'read'=>0,
                        'conversation_id'=>$u->conversation->id,
                        'property_of_interest_id'=>$property_of_interest
                    ])
                    ->count();
                $u->lastMsg = DB::table('messages')
                    ->where([
                        'read'=>0,
                        'conversation_id'=>$u->conversation->id,
                        'property_of_interest_id'=>$property_of_interest
                    ])
                    ->orderBy('created_at','desc')
                    ->first();
            }else{
                $u->unreadCount = 0;
                $u->lastMsg = [];
            }

        }

        return json_encode(['data'=>$users]);
    }

    public function agentsUserMessages(Request $request){

        $conversation_id = $request->get('conversation_id');
        $property_of_interest = $request->get('property_of_interest');

        $messages = DB::table('messages')
            ->where(['property_of_interest_id'=>$property_of_interest,'conversation_id'=>$conversation_id])
            ->orderBy('created_at','desc')
            ->limit(20)
            ->get();

        return json_encode(['data'=>$messages]);

    }

    public function userMessages(Request $request){

        $conversation_id = $request->get('conversation_id');
        $property_of_interest = $request->get('property_of_interest');

        $messages = DB::table('messages')
            ->where(['property_of_interest_id'=>$property_of_interest,'conversation_id'=>$conversation_id])
            ->orderBy('created_at','desc')
            ->limit(20)
            ->get();

        return json_encode(['data'=>$messages]);

    }

    public function saveMessage(Request $request){

        $currentUser = auth()->user();

        $formData = $request->all();

        DB::table('messages')->insert([
            'conversation_id'=>$formData['conversation_id'],
            'property_of_interest_id'=>$formData['property_of_interest_id'],
            'sender_id'=>$currentUser->id,
            'body'=>$formData['message'],
            'created_at'=>date('Y-m-d H:i:s')
            
        ]);

        $messages = DB::table('messages')
            ->where([ 'conversation_id'=>$formData['conversation_id'],
            'property_of_interest_id'=>$formData['property_of_interest_id'],])
            ->orderBy('created_at','desc')
            ->get();


        //store the message and return the updated messages 

        //get the newly added messages

        return json_encode(['data'=>$messages]); 


    }
}
