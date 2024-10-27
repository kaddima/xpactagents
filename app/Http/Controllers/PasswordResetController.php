<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

require __DIR__ . '/../../../Business/mailer.php';
use Business\Mailer;

class PasswordResetController extends Controller
{
    //

    public function showforgetpasswordform(){

        return view('auth.forgot_password');
    }

    public function submitforgetpasswordform(Request $request){

        $request->validate([
           'email'=>'required|email|exists:users'
        ]);

        $token = Str::random(64);

        $email = $request->get('email');

        $url = route('resetpassword.get',['token'=>$token]);

        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        //set up email message and url to send to user
        $message = <<<EMAIL
        <div style="width:80%;padding: 20px 10px;margin: auto;" class="border">
        <div style="text-align: center">
            <h2 style="font-size: 2rem;font-weight: bold; margin-bottom: 12px;opacity: .8">Password Reset</h2>
            <p>You have requested to reset your password on xpactagent.com.
            Please click the link below to reset your password.</p>

            <a href="$url" style="background: #007bff; padding: .5em;
                        text-decoration: none; color: white;display: inline-block; margin-top: 1rem;">Reset Password</a>
            <div style="margin-top: 3rem;font-size: 13px; opacity: .85">
                <p >If you did not request a password reset, you can safely ignore
                this email. Only a person with access to your email can reset your account password</p>
            </div>
        </div>
    </div>
EMAIL;

        Mailer::sendMail($email,$message,'Password Reset');

       return back()->withInput()->with('message', 'We have e-mailed your password reset link!');
    }

    public function showResetPasswordForm($token){

        return view('auth.reset_password', ['token'=>$token]);
    }

    public function submitResetPasswordForm(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:6',
            'verify' => 'required|same:password'
        ]);

        $updatePassword = DB::table('password_resets')
            ->where([
                'token' => $request->get('token')
            ])
            ->first();

        if(!$updatePassword){
            return back()->withInput()->with('error', 'Invalid token!');
        }


        $user = User::where('email', $updatePassword->email)
            ->update(['password' => Hash::make($request->password)]);

        DB::table('password_resets')->where(['email'=> $updatePassword->email])->delete();

        return redirect('/signin')->with('message', 'Your password has been changed!');
    }

    public function changePassword(Request $request){

        $user_id = auth()->user()['id'];
        $data = request()->all();
        $errors = [];
        $status = 1;
    
        if (empty($data['password']) || empty($data['new_password'])
            || empty($data['confirm_password'])){
            $status = 0;
            $errors[] = 'All passwords must be filled';
        }
    
        if (strlen($data['new_password']) < 6 ){
            $status = 0;
            $errors[] = 'Minimum pasasword length is six';
        }
        if ($data['new_password'] !== $data['confirm_password']){
            $status = 0;
            $errors[] = 'Password do not match';
        }
    
        if (!Hash::check($data['password'],auth()->user()['password'])){
            $status = 0;
            $errors[] = 'Old password is wrong';
        }
    
        if ($status){
    
            DB::table('users')
                ->where(['id'=>$user_id])
                ->update(['password'=>Hash::make($data['new_password'])]);
    
            return json_encode(['status'=>1]);
        }else{
    
            return json_encode(['status'=>0, 'errors'=>$errors]);
        }
    
    }
}
