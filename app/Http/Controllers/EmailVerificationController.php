<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
require __DIR__ . '/../../../Business/mailer.php';
use Business\Mailer;


class EmailVerificationController extends Controller
{
    public function ResendEmail(Request $request){

        $token = $token = rand(100000,999999);;

        $data = $request->all();
    
        if(!$request->has('email')){
    
            return json_encode(['success'=>'redirect']);
        }
    
        DB::table('users')
        ->where(['email'=>$data['email']])
        ->update(['activation_code'=>password_hash($token,PASSWORD_DEFAULT)]);
       
        $subject = 'Email Verification';
        $message = <<<EMAIL
        <div style='margin-top:10px'>
            <h1 style="font-size:18px; font-weight:bold;">Confirm your registration</h1>

            <div style="margin-top:10px;">
                <p style="margin: 0;padding:0;">Welcome to Xpact Agent</p>
                <p style="margin: 0;padding:0;">Here is your account activation code</p>
            </div>

            <h1>$token</h1>

            <div>
                <h4>Security tips</h4>
                <ul style="padding-left: 20px;">
                    <li>Never give your password to anyone</li>
                    <li>Never call any phone number or personal details for anyone claiming to be XpactAgent support.</li>
                </ul>
            </div>

            <p style="font-size:13px;">This step is to ensure that your email address is not used without your consent. 
                You can ignore this email if this was not triggered by you</p>

            <div style="color: rgb(129, 122, 122);">
                <p style="margin: 0;padding:0;">XpactAgent Team</p>
                <span>This is an automated message please do not reply</span>
            </div>
        </div>
EMAIL;

    
      // Mailer::sendMail($data['email'],$message,$subject,true);
    
       return json_encode(['success'=>1,'data'=>$token]);
    }

    public function verifyEmailToken(Request $request){

         //get the email
        $data = $request->all();  

        if (isset($data['email']) && isset($data['token'])){

            $user = User::where('email',$data['email'])->first();

            if ($user && $user['email_verify'] == 0){

                if (password_verify($data['token'],$user->activation_code)){

                    User::where('email',$data['email'])->update(['email_verify'=>1]);

                    auth()->login($user,true);

                    return json_encode(['status'=>1,'user'=>$user, 'is_agent'=>$user->is_agent]);
                }

                return json_encode(['status'=>0, 
                'error'=>'Verification code is wrong.','token'=>$data['token']]);

            }   
        }
        
        return json_encode([]);
    }
}
