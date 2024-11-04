<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdmsController extends Controller
{
    public function admsOverview(){

        if(Auth::check() && Auth::user()->is_admin == 1 && Auth::user()->super_admin == 1){

                //get the current User
            $currentUser = Auth::user();

                $obj = new \stdClass();

                //get count for rent,land,house for sell,short-let
                $totalUsersCount  = DB::table('users')
                    ->count();
    
                $agentsCount  = DB::table('users')
                    ->where(['is_agent'=>'1',])
                    ->count();

                $adminsCount = DB::table('users')
                ->where(['is_admin'=>'1',])
                ->count();

                $regularUsersCount = DB::table('users')
                ->where(['is_agent'=>'0',])
                ->count();

                $recentAdmins = DB::table('users')
                    ->where('is_admin',1)
                    ->orderBy('created_at','desc')
                    ->limit(6)
                    ->get();

                $obj->totalUsersCount  = $totalUsersCount ;
                $obj->agentsCount = $agentsCount;
                $obj->adminsCount = $adminsCount;
                $obj->regularUsersCount = $regularUsersCount;
                $obj->recentAdmins = $recentAdmins;
    

                return json_encode(['data'=>$obj]);
            
        }
        
    }

    public function admsAdmins(){
        
        if(Auth::check() && Auth::user()->super_admin == 1){

            $users = User::where('is_admin', 1)
                ->paginate(20);

            return json_encode(['data'=>$users]);
        }
    }

    public function admsUsers(){
        
        if(Auth::check() && Auth::user()->super_admin == 1){

            $users = User::paginate(20);

            return json_encode(['data'=>$users]);
        }
    }

    public function admsMakeAdmin(Request $request){

        $user_id = $request->get('user_id');

        $user = DB::table('users')
        ->where(['id'=>$user_id])
        ->first(['id','is_admin','is_agent']);

        if ($user->is_admin == 0){
            DB::table('users')
            ->where(['id'=>$user_id])
            ->update(['is_admin'=>1]);
        }else{

            DB::table('users')
                ->where(['id'=>$user_id])
                ->update(['is_admin'=>0]);
        }
        

        return json_encode(['status'=>1]);

    }
}
