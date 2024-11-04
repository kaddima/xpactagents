<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

require __DIR__ . '/../../../Business/mailer.php';
use Business\Mailer;


class RegisterController extends Controller
{
    //
    public function create(){

        return view('signup');

    }

    public function store(Request $request){

        $token = rand(100000,999999);
        $column_value = [];
        $formdata = $request->all();

        if($request->has('reg_type') && $request->input('reg_type') == 'user'){

            $validator = Validator::make($request->all(),[
                'email' => 'required|email|unique:users',
                'first_name'=>'required',
                'last_name'=>'required',
                'phone'=>'required|min:11',
                'password' => 'required|min:6',
                'c_password'=>'required|same:password'
                 ]);

                 

            if($validator->fails()){

                return json_encode(['status'=>0,'errors'=>$validator->errors()]);
            }

            $column_value = [
                'email' => preg_replace('/(^wwww\.|^www\.|^ww\.)/', '',$formdata['email']),
                'first_name'=>$formdata['first_name'],
                'last_name'=>$formdata['last_name'],
                'phone'=>$formdata['phone'],
                'password' =>$formdata['password'],
                'activation_code'=>password_hash($token,PASSWORD_DEFAULT)
            ];
        }
        
        if($request->has('reg_type') && $request->input('reg_type') == 'agent'){

            $validator = Validator::make($request->all(),[
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
                'c_password'=>'required|same:password'
                 ]);

            if($validator->fails()){

                return json_encode(['status'=>0,'errors'=>$validator->errors()]);
            }

            $column_value = [
                'email' => preg_replace('/(^wwww\.|^www\.|^ww\.)/', '',$formdata['email']),
                'password' =>$formdata['password'],
                'activation_code'=>password_hash($token,PASSWORD_DEFAULT),
                'is_agent'=>1
            ];
        }

        $user = User::create($column_value);

        $subject = 'Email Verification';
        $message = <<<EMAIL
        <div style="margin-top:10px">
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

       //Mailer::sendMail($formdata['email'],$message,$subject,true);

        //return redirect()->intended('register')->with('success',true);

        return json_encode(['status'=>1,'data'=>1]);

    }
}
