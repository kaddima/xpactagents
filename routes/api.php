<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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
	// Authentication route
	Route::controller(AuthenticationController::class)->group(function () {
		Route::post('/login', "login");
		Route::post('/register', "register");
		Route::post('/register/resend-otp', "resendOTPEmail");
		Route::post('/register/verify-email', "verifyEmail");
		Route::post('/password/send-reset-token', 'sendPasswordResetToken');
		Route::post('/password/reset', 'resetPassword');
	});

	Route::get('/properties', [PropertyController::class, 'getProperties']);
	Route::get('/properties/{id}', [ListingController::class, 'propertyDetails']);

	/**user must be authenticated to access this routes */
	Route::middleware('auth:sanctum')->group(function () {
		Route::post('/logout', [AuthenticationController::class, "logout"]);
	});


	Route::middleware(['auth:sanctum', 'agent_or_admin'])->group(function () {
		//POST METHODS
		Route::post('/properties', [PropertyController::class, 'create']);
		Route::post('/properties/images', [PropertyController::class, 'uploadFile']);
		
		//PUT METHODS
		Route::put('/properties/{id}', [PropertyController::class, 'update']);
		
		//DELETE METHODS
		//Route::delete('/properties/{id}', [PropertyController::class, 'delete']);
		Route::delete('/properties/images', [PropertyController::class, 'deletePropertyImages']);
	});

});

Route::get('/listings', [ListingController::class, 'listings']);
Route::get('/listings/details', [ListingController::class, 'propertyDetails']);;
