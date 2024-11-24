<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;

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

	/**user must be authenticated to access this routes */
	Route::middleware('auth:sanctum')->group(function () {

		Route::controller(UserController::class)->group(function () {
			Route::get('/users/{user_id}', 'getUserdetails');
			Route::post('/users/password/change', 'changePassword');
		});

		Route::get('/properties/favorites', [PropertyController::class, 'getFavoriteProperties']);
		Route::post('/properties/{id}/favorite', [PropertyController::class, 'addFavorite']);
		Route::delete('/properties/{id}/favorite', [PropertyController::class, 'removeFavorite']);
		Route::get('/properties/conversations', [MessageController::class, 'getUserConversations']);
		Route::post('/properties/conversations', [MessageController::class, 'createConversation']);
		Route::post('/properties/messages', [MessageController::class, 'sendMessage']);
		Route::post('/properties/conversations/{id}/messages/read', [MessageController::class, 'markMessagesRead']);
		Route::get('/properties/conversations/{id}/messages', [MessageController::class, 'getMessages']);
		Route::post('/logout', [AuthenticationController::class, "logout"]);
	});

	Route::get('/properties', [PropertyController::class, 'getProperties']);
	Route::get('/properties/search', [PropertyController::class, 'searchProperties']);
	Route::get('/properties/{id}', [PropertyController::class, 'getPropertyDetails']);
	Route::get('/properties/{id}/images', [PropertyController::class, 'getPropertyImages']);

	Route::middleware(['auth:sanctum', 'agent_or_admin'])->group(function () {

		Route::get('/agents/properties/properties-of-interest', [MessageController::class, 'getAgentPoi']);
		Route::get('/agents/properties/{id}/conversations', [MessageController::class, 'getPropertyConversations']);
		Route::post('/agents/properties/messages/resolve', [MessageController::class, 'resolveMessage']);

		Route::controller(PropertyController::class)->group(function () {
			Route::post('/properties', 'create');
			Route::post('/properties/images', 'uploadFile');
			Route::put('/properties/{id}', 'updateProperty');
			Route::put('/properties/{id}/published/{published}', 'publishedStatus');
			Route::delete('/properties/{id}',  'deleteProperty');
			Route::delete('/properties/images', 'deletePropertyImages');
			Route::get('/agents/{agent_id}/dashboard/overview', 'agentOverview');
			Route::get('/agents/{agent_id}/properties', 'agentProperties');
			Route::get('/agents/{agent_id}/properties/search', 'searchAgentProperties');
			Route::get('/agents/{agent_id}/properties/{id}', 'agentPropertyDetails');
		});
	});

	Route::middleware(['auth:sanctum', 'admin'])->group(function () {
		Route::controller(PropertyController::class)->group(function () {
			Route::get('/admin/agents/{agent_id}/properties', 'adminAgentProperties');
		});
	});
});

Route::get('/listings', [ListingController::class, 'listings']);
Route::get('/listings/details', [ListingController::class, 'propertyDetails']);;
