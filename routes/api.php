<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\TourController;
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

	Route::controller(TourController::class)->group(function () {
		Route::post("/tours", "addNewTour");
	});

	/**user must be authenticated to access this routes */
	Route::middleware('auth:sanctum')->group(function () {

		Route::controller(UserController::class)->group(function () {
			Route::patch('/users/lastseen', 'updateUserLastSeen');
			Route::put('/users', 'updateUserDetails');
			Route::patch('/users/password', 'changePassword');
			Route::post('/users/image', 'uploadUserImage');
			Route::post('/users/verification', 'idVerificationRequest');
			Route::get('/users/{user_id}', 'getUserdetails');
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

	Route::middleware(['auth:sanctum', 'agent_or_admin'])->group(function () {
		Route::get("/tours", [TourController::class, "agentTours"]);
		Route::patch("tours/{tour_id}", [TourController::class, "resolveTour"]);
		Route::get('/agents/properties/properties-of-interest', [MessageController::class, 'getAgentPoi']);
		Route::get('/agents/properties/{id}/conversations', [MessageController::class, 'getPropertyConversations']);
		Route::post('/agents/properties/conversation/resolve', [MessageController::class, 'resolveConversation']);
		Route::get('/agents/overview', [UserController::class, 'agentOverviewData']);

		Route::controller(PropertyController::class)->group(function () {
			Route::post('/properties', 'create');
			Route::post('/properties/images', 'uploadFile');
			Route::put('/properties/{id}', 'updateProperty');
			Route::put('/properties/{id}/published/{published}', 'publishedStatus');
			Route::delete('/properties/images', 'deletePropertyImages');
			Route::delete('/properties/{id}',  'deleteProperty');
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

	Route::get('/properties', [PropertyController::class, 'getProperties']);
	Route::get('/properties/search', [PropertyController::class, 'searchProperties']);
	Route::get('/properties/{id}', [PropertyController::class, 'getPropertyDetails']);
	Route::get('/properties/{id}/images', [PropertyController::class, 'getPropertyImages']);
});
