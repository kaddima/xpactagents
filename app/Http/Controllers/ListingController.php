<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ListingController extends Controller
{
    //Create new property
    public function createProperty(Request $request){

        $user_id = auth()->user()['id'];
        $data = $request->all();
        $img = [];


        $column_value = [
            'name'=>$data['name']?$data['name']:null,
            'images'=>json_encode([]),
            'address'=>$data['address']?$data['address']:null,
            'amount'=>$data['amount']?$data['amount']:null,
            'category'=>$data['property_category']?$data['property_category']:null,
            'description'=>$data['description']?$data['description']:null,
            'size'=>isset($data['size']) ? $data['size'] : null,
            'property_type'=>$data['property_type']?$data['property_type']:null,
            'property_fact'=>$data['property_fact']?json_encode($data['property_fact']):null,
            'creator_id'=>$user_id,
            'amenities'=>$data['amenities']?json_encode($data['amenities']):json_encode([]),
            'setup'=>1,
            'duration'=>isset($data['duration']) ? $data['duration'] : null,
            'state'=>isset($data['state']) ? $data['state'] : null,
            'other_category'=>isset($data['other_category']) ? $data['other_category'] : null,
            'lga'=>isset($data['lga']) ? $data['lga'] : null,
            'bedrooms'=>isset($data['bedrooms']) ? $data['bedrooms'] : null,
            'toilets'=>isset($data['toilets']) ? $data['toilets'] : null,
            'bathrooms'=>isset($data['bathrooms']) ? $data['bathrooms'] : null
            ];


        $property_id = DB::table('property')
            ->insertGetId($column_value);


        return json_encode(['data'=>['property_id'=>$property_id]]);

        //return json_encode(['data'=>$column_value]);


    }

    public function updateProperty(Request $request){

        $data = $request->all();

        //logged in admin
        $user_id = auth()->user()['id'];

        $column_value = [
            'name'=>$data['name']?$data['name']:null,
            'address'=>$data['address']?$data['address']:null,
            'amount'=>$data['amount']?$data['amount']:null,
            'category'=>$data['property_category']?$data['property_category']:null,
            'description'=>$data['description']?$data['description']:null,
            'size'=>isset($data['size']) ? $data['size'] : null,
            'property_type'=>$data['property_type']?$data['property_type']:null,
            'property_fact'=>$data['property_fact']?json_encode($data['property_fact']):null,
            'creator_id'=>$user_id,
            'amenities'=>$data['amenities']?json_encode($data['amenities']):json_encode([]),
            'setup'=>1,
            'duration'=>isset($data['duration']) ? $data['duration'] : null,
            'state'=>isset($data['state']) ? $data['state'] : null,
            'lga'=>isset($data['lga']) ? $data['lga'] : null,
            'other_category'=>isset($data['other_category']) ? $data['other_category'] : null,
            'bedrooms'=>isset($data['bedrooms']) ? $data['bedrooms'] : null,
            'toilets'=>isset($data['toilets']) ? $data['toilets'] : null,
            'bathrooms'=>isset($data['bathrooms']) ? $data['bathrooms'] : null
        ];

        //update the table
        DB::table('property')
        ->where(['id'=>$data['property_id']])
        ->update($column_value);


        return json_encode(['status'=>1]);

    }

    public function uploadPropertyImage(Request $request){

        $user_id = auth()->user()['id'];
        $photoPattern = '#^(image/)[^\s\n<]+$#i';

        $file = $request->file('image');
        $property_id = $request->get('property_id');

        $error = '';
        $status = 1;

        //directory to upload image
        $upload_dir = public_path('uploads/users/'.$user_id.'/');

        $name = $file->getClientOriginalName();
        $size = $file->getSize();
        $target = $upload_dir.$name;


        if ((floatval($size)/1000) > 2200){
            $error = 'file too large -- 500kb and below';
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
            $file->move($upload_dir,$name);

            //get the images from the property table by property_id

            $property = DB::table('property')
                ->where('id',$property_id)
                ->first();

            $images = $property->images ? (array)json_decode($property->images) : [];

            $images[] = $name;

            //insert the photo to database

            $columnValue = [
                'images'=>json_encode($images)
            ];

            DB::table('property')
                ->where('id',$property_id)
                ->update($columnValue);

            return json_encode(['status'=>$status, 'error'=>$error,'photos'=>$images]);


        }

        return json_encode(['status'=>$status, 'error'=>$error]);

    }

    public function deletePropertyImage(Request $request){

        $user_id = auth()->user()['id'];

        $data = $request->all();
        $property_id = $data['property_id'];

        //directory to upload image
        $upload_dir = public_path('uploads/users/'.$user_id.'/');

        $target = $upload_dir.$data['image'];


        //get the images from the property table by property_id

        $property = DB::table('property')
            ->where('id',$property_id)
            ->first();

        $images = $property->images ? (array)json_decode($property->images) : [];

        for ($i=0,$len = count($images); $i<= $len; $i++){

            if($images[$i] == $data['image']){

                if(unlink($target)){

                    unset($images[$i]);

                    //insert the photo to database

                    $columnValue = [
                        'images'=>json_encode($images)
                    ];

                    DB::table('property')
                        ->where('id',$property_id)
                        ->update($columnValue);


                    return json_encode(
                        ['status'=>1,
                            'photos'=>array_values($images)
                        ]);
                }

            }
        }

        return json_encode(
            ['status'=>1,
                'photos'=>array_values($images)
            ]);
    }

    public function listings(Request $request){

        //get the category
        $other_category = $request->get('other_category');

        if(strtolower($other_category) !== 'any' && isset($other_category)){

            $listings = DB::table('property')
            ->where('published', 1)
            ->where('other_category',strtolower($other_category))
            ->paginate(20);
        }else{
            $listings = DB::table('property')
            ->where('published', 1)
            ->paginate(20);
        }
        
        return json_encode(['data'=>$listings]);

    }

    public function agentListings(Request $request){
        $currentUser = auth()->user();

        $listings = DB::table('property')
            ->where('creator_id',$currentUser->id)
            ->paginate(20);
       
        return json_encode(['data'=>$listings]);

    }

    public function latestProperty(){

        //get land for sell
        $properties = DB::table('property')
        ->where('setup',1)
        ->orderBy('created_at','desc')
        ->limit(6)
        ->get();

        $properties = $this->GetImage($properties);

        return json_encode(['data'=>$properties]);
    }

    public function PropertyByCategory(Request $request){

        $category = $request->get('category');

        //get land for sell
        $properties = DB::table('property')
        ->where('category',$category)
        ->orderBy('created_at','desc')
        ->paginate(12);

        $properties = $this->GetImage($properties);

        return json_encode(['data'=>$properties]);
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


           # code...
       }

       return $obj;

    }

    public function deleteProperty(Request $request){

        $property_id = $request->input('property_id');
        $currentUser = auth()->user();

        $property = DB::table('property')
        ->where(['id'=>$property_id])
        ->first();

        //directory to upload image
        $upload_dir = public_path('uploads/users/'.$currentUser->id.'/');

        if($property->creator_id == $currentUser->id){
            //check if the property has images and has been setup
            $propertyPhotos = json_decode($property->images);

            if(count($propertyPhotos) > 0){
                for ($i=0,$len = count($propertyPhotos); $i< $len; $i++){

                    $target = $upload_dir.$propertyPhotos[$i];

                    unlink($target);
                }
            }



            DB::table('property')
            ->where('id', $property_id)
            ->delete();

            return json_encode(['data'=>$propertyPhotos, 'crea_id'=>$property->creator_id, 'user'=>$currentUser]);
        }

        return json_encode(['data'=>'Unauthorized user.']);
    }

    public function publishProperty(Request $request){

        $property_id = $request->input('property_id');

        $currentUser = auth()->user();

        if($currentUser->profile_complete != 1){
            return [];
        }
        //get the property
        $property = DB::table('property')
            ->where(['id'=>$property_id])
            ->first(['id','published','creator_id']);

        if($currentUser->id == $property->creator_id){

            if ($property->published == 0){

                DB::table('property')
                ->where(['id'=>$property_id])
                ->update(['published'=>1]);

            }else{

                DB::table('property')
                ->where(['id'=>$property_id])
                ->update(['published'=>0]);
            }
        }

        // $propertyDetails = DB::table('property')
        // ->where('id',$property_id)
        // ->first('published');

        return json_encode(['status'=>1,'data'=>$property_id]);
    }


    public function propertyDetails(Request $request){

        $property_id = $request->get('propertyID');

        $propertyDetails = DB::table('property')
            ->where('id',$property_id)
            ->first();

        $propertyDetails->agentDetails = DB::table('users')
            ->where('id',$propertyDetails->creator_id)
            ->first();

        //similar property search querry
        $similar = [
            'state'=>$propertyDetails->state,
            'published'=>1,
            'category'=>$propertyDetails->category,
            ['id','!=',$propertyDetails->id],
            //['amount', '<=',$propertyDetails->amount]
        ];

        $propertyDetails->similar = DB::table('property')
        ->where($similar)
        ->limit(6)
        ->get();

        return json_encode([
            'data'=>$propertyDetails,
            'id'=>$property_id
            ]);
    }

    public function favorite(Request $request){

        $property_id = $request->get('property_id');
        $currentUser = auth()->user();


        //get the favorite from the users table

        $userDetails = User::find($currentUser->id);

        $favorite_properties = $userDetails->favorite_properties ? json_decode($userDetails->favorite_properties) : [];

        for ($i=0; $i < count($favorite_properties) ; $i++) { 
            
            if($favorite_properties[$i] == $property_id){

                //remove
                unset($favorite_properties[$i]);

                $favorite_properties = array_values($favorite_properties);

                //save the current favorites
                DB::table('users')
                    ->where('id',$currentUser->id)
                    ->update(['favorite_properties'=>json_encode($favorite_properties)]);

                    $userDetails->favorite_properties = json_encode($favorite_properties);

                    return json_encode(['data'=>$userDetails]);
            }
        }

        array_push($favorite_properties,$property_id);

            //save the current favorites
            DB::table('users')
            ->where('id',$currentUser->id)
            ->update(['favorite_properties'=>json_encode($favorite_properties)]);

            $userDetails->favorite_properties = json_encode($favorite_properties);

        return json_encode(['data'=>$userDetails,'status'=>'got on']);
        
        
    }

    public function getFavorites(Request $request){

        //get the user
        $currentUser = auth()->user();
        $favorites = User::find($currentUser['id']);
          

        $favorites = json_decode($favorites->favorite_properties);

        $favorite_properties = [];

        for ($i=0; $i < count($favorites); $i++) { 
            $property = DB::table('property')
                ->where('id', $favorites[$i])
                ->first();

            array_push($favorite_properties,$property);
        }

        return json_encode(['data'=>$favorite_properties,'user'=>$currentUser]);
    }

    public function searchProperty(Request $request){

        $searchTerms = $request->all();
        $column_value = [];

        foreach($searchTerms as $key=>$value){

            if(isset($key)){

                if($key == 'baths'){
                    if(strtolower($value) == 'any'){
                        $column_value[] = ['bathrooms', '>=',1];
                        continue;
                    }
                    if($value < 5){
                        $column_value['bathrooms'] = $value ;
                    }else{
                        $column_value[] = ['bathrooms', '>=',$value];
                    } 
                    continue;
                }else if($key == 'beds'){

                    if(strtolower($value) == 'any'){
                        $column_value[] = ['bedrooms', '>=',1];
                        continue;
                    }

                    if($value < 5){
                        $column_value['bedrooms'] = $value;
                    }else{
                        $column_value[] = ['bedrooms', '>=',$value];
                    }   
                    continue;
                }
                else if($key == 'min_price'){
                    $column_value[] = ['amount', '>=',$value];
                    continue;
                }else if($key == 'max_price'){
                    $column_value[] = ['amount', '<=', $value ];
                    continue;
                }else if($key == 'page'){
                    continue;
                }

                $column_value[$key] = $value;
            }
        }

        $properties = DB::table('property')
            ->where($column_value)
            ->where('published',1)
            ->paginate(20);

        return json_encode(['data'=>$properties]);
    }

    public function agentSearchProperty(Request $request){

         $currentUser = auth()->user();

        $searchTerms = $request->all();
        $column_value = ['creator_id'=>$currentUser->id];

        foreach($searchTerms as $key=>$value){

            if(isset($key)){

                if($key == 'baths'){
                    if(strtolower($value) == 'any'){
                        $column_value[] = ['bathrooms', '>=',1];
                        continue;
                    }
                    if($value < 5){
                        $column_value['bathrooms'] = $value ;
                    }else{
                        $column_value[] = ['bathrooms', '>=',$value];
                    } 
                    continue;
                }else if($key == 'beds'){

                    if(strtolower($value) == 'any'){
                        $column_value[] = ['bedrooms', '>=',1];
                        continue;
                    }

                    if($value < 5){
                        $column_value['bedrooms'] = $value;
                    }else{
                        $column_value[] = ['bedrooms', '>=',$value];
                    }   
                    continue;
                }
                else if($key == 'min_price'){
                    $column_value[] = ['amount', '>=',$value];
                    continue;
                }else if($key == 'max_price'){
                    $column_value[] = ['amount', '<=', $value ];
                    continue;
                }else if($key == 'page'){
                    continue;
                }

                $column_value[$key] = $value;
            }
        }

        $properties = DB::table('property')
            ->where($column_value)
            ->where('published',1)
            ->paginate(20);

        return json_encode(['data'=>$properties]);
    }



}
