<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\PropertyController;
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
	Route::get('/properties/{id}', [PropertyController::class, 'getPropertyDetails']);

	/**user must be authenticated to access this routes */
	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/properties/favorite', [PropertyController::class, 'getFavoriteProperties']);
		Route::post('/properties/{id}/favorite', [PropertyController::class, 'addFavorite']);
		Route::delete('/properties/{id}/favorite', [PropertyController::class, 'removeFavorite']);
		Route::post('/logout', [AuthenticationController::class, "logout"]);
	});


	Route::middleware(['auth:sanctum', 'agent_or_admin'])->group(function () {
		Route::controller(PropertyController::class)->group(function () {
			Route::post('/properties', 'create');
			Route::post('/properties/images', 'uploadFile');
			Route::put('/properties/{id}', 'updateProperty');
			Route::put('/properties/{id}/published/{published}', 'publishedStatus');
			Route::delete('/properties/{id}',  'deleteProperty');
			Route::delete('/properties/images', 'deletePropertyImages');
		});
	});
});

Route::get('/listings', [ListingController::class, 'listings']);
Route::get('/listings/details', [ListingController::class, 'propertyDetails']);;
