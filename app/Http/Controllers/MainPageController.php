<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MainPageController extends Controller
{
    public function index(){

        //get featured property

        $featured_property = DB::table('property')
            ->where('published',1)
            ->orderBy('created_at','desc')
            ->limit(7)
            ->get();

        $featured_property = $this->GetImage($featured_property);

        //get the houses for sell
        $forSell = DB::table('property')
            ->where(['published'=>1,'category'=>'sell'])
            ->orderBy('created_at','desc')
            ->limit(7)
            ->get();

        $forSell = $this->GetImage($forSell);

        return view('index', ['featuredProperty'=>$featured_property,'forSell'=>$forSell]);
    }

    public function propertyDetails($id){

        $property_id = $id;

        $propertyDetails = DB::table('property')
            ->where('id',$property_id)
            ->first();

        $propertyDetails->photos = DB::table('photos')
            ->where('property_id', $property_id)
            ->get();

        $propertyDetails->agentDetails = DB::table('agents')
            ->where('id',$propertyDetails->agent_id)
            ->first();

        $similarProperty = DB::select('SELECT * from property WHERE 
                 id != :id AND category = :category', [':id'=>$id,':category'=>$propertyDetails->category]);

        $similarProperty = $this->GetImage($similarProperty);

        
        $featured_property = DB::table('property')
            ->where('published',1)
            ->orderBy('created_at','desc')
            ->limit(3)
            ->get();

        $featured_property = $this->GetImage($featured_property);
            
        return view('propertyDetails',['propertyDetails'=>$propertyDetails,
            'similarProperty'=>$similarProperty,
            'featuredProperty'=>$featured_property]);
    }

    /**Append image names to the properties */
    public function GetImage($obj){

        foreach ($obj as $key => $value) {

            //get the first image name of that property and append to the obj
            $image = DB::table('photos')
                ->where('property_id', $value->id)
                ->first();

            //check if image is empty
            if(empty($image)){
                unset($obj[$key]);
                continue;
            }

            $value->image = $image->name;

        }

       return $obj;

    }

    public function propertyListings(){

        //get rent property

        $rents = DB::table('property')
            ->where('category','rent')
            ->orderBy('created_at','desc')
            ->limit(6)
            ->get();

        $rents = $this->GetImage($rents);


        //get short let properties
        $short_let = DB::table('property')
        ->where('category','short_let')
        ->orderBy('created_at','desc')
        ->limit(6)
        ->get();

        $short_let = $this->GetImage($short_let);

        //get house for sell
        $for_sell = DB::table('property')
        ->where('category','sell')
        ->orderBy('created_at','desc')
        ->limit(6)
        ->get();

        $for_sell = $this->GetImage($for_sell);

        //get land for sell
        $land = DB::table('property')
        ->where('category','land')
        ->orderBy('created_at','desc')
        ->limit(6)
        ->get();

        $land = $this->GetImage($land);

        return view('listings',
            ['propertyListings'=>[
            'rent'=>$rents,
            'short_let'=>$short_let,
            'sell'=>$for_sell,
            'land'=>$land
        ]]);
       
    }

    public function PropertyByCategory($category){

        //get land for sell
        $properties = DB::table('property')
        ->where('category',$category)
        ->orderBy('created_at','desc')
        ->paginate(12);

        $properties = $this->GetImage($properties);

        return view('listingByCategory',['properties'=>$properties]);
    }

    public function bookAppointment(Request $request){

       $data = $request->all();

       unset($data['_token']);

       DB::table('appointments')
        ->insert($data);

       return json_encode(['data'=>$data]);
    }
}
