<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TourController;
use App\Http\Controllers\ListingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API! '/api/property/details'
|
*/

Route::prefix('v1')->group(function () {
	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/user', function (Request $request) {
			return $request->user();
		});
	});

	Route::get('/listings', [ListingController::class, 'listings']);
	Route::get('/listings/details', [ListingController::class, 'propertyDetails']);;
});
