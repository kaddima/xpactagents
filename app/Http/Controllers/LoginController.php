<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    //
    public function create(){

        return view('login');
    }

    public function store(Request $request){

        $valid = 1;
        $error = [];

        $request->validate([
           'email'=>'required|email',
           'password'=>'required'
        ]);

        $credentials = $request->only('email','password');

        if($valid){

            if (Auth::attempt($credentials,true)){

                $request->session()->regenerate();
                
                return json_encode(['userInfo'=>Auth::user()]);

            }

            return json_encode(['failed'=>"Wrong username or password"]);

        }

        return json_encode(['failed'=>$error[0]]);
        
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::logout();
    
        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    
        return redirect('/');
    }
}
