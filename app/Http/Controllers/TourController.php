<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TourController extends Controller
{
    //
    public function store(Request $request){

        $data = $request->all();

        $property = DB::table('property')
            ->where('id', $data['property_id'])
            ->first(['creator_id']);

        if($property){
            $tour = new Tour();

            $tour->first_name = $data['first_name'];
            $tour->last_name = $data['last_name'];
            $tour->property_id = $data['property_id'];
            $tour->agent_id = $property->creator_id;
            $tour->phone = $data['phone'];
            $tour->date = $data['dateTime'];
            $tour->best_contact = $data['best_contact'];
            $tour->notes = $data['notes'];

            $tour->save();
        }

        return json_encode(['data'=>$data]);

    }

    public function getAgentTour(Request $request){

        $agent_id = auth()->user()['id'];

        $tours = Tour::where(['agent_id'=>$agent_id,'resolved'=>0])->get();

        return json_encode(['data'=>$tours]);

    }

    public function resolveTour(Request $request){

        $agent_id = auth()->user()['id'];
        $tour_id = $request->input('tour_id');

        $tour = Tour::find($tour_id);
        $tour->resolved = 1;
        $tour->save();

        return json_encode(['data'=>$tour]);
    }
}
