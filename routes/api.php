<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\Api\MessageController;
use App\Models\Message;

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
		Route::get('/properties/favorites', [PropertyController::class, 'getFavoriteProperties']);
		Route::post('/properties/{id}/favorite', [PropertyController::class, 'addFavorite']);
		Route::delete('/properties/{id}/favorite', [PropertyController::class, 'removeFavorite']);
		Route::get('/properties/conversations', [MessageController::class, 'getUserConversations']);
		Route::post('/properties/conversations', [MessageController::class, 'createConversation']);
		Route::post('/properties/messages', [MessageController::class, 'sendMessage']);
		Route::post('/properties/conversations/{id}/messages/read',[MessageController::class,'markMessagesRead']);
		Route::get('/properties/conversations/{id}/messages', [MessageController::class, 'getMessages']);
		Route::post('/logout', [AuthenticationController::class, "logout"]);
	});

	Route::get('/properties', [PropertyController::class, 'getProperties']);
	Route::get('/properties/search', [PropertyController::class, 'searchProperties']);
	Route::get('/properties/{id}', [PropertyController::class, 'getPropertyDetails']);
	Route::get('/properties/{id}/images', [PropertyController::class, 'getPropertyImages']);

	Route::middleware(['auth:sanctum', 'agent_or_admin'])->group(function () {

		Route::get('/agents/properties/conversations', [MessageController::class, 'getAgentConversations']);
		Route::get('/agents/properties/{id}/conversations', [MessageController::class, 'getPropertyConversations']);

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

Route::post('/question/send-messge', [MessageController::class, 'store']);
Route::post('/agents/message/send', [MessageController::class, 'saveMessage']);
Route::get('/agent/message/property-of-interest', [MessageController::class, 'agentsPropertyOfInterest']);
Route::get('/users/message/property-of-interest', [MessageController::class, 'usersPropertyOfInterest']);
Route::get('/agent/message/participants', [MessageController::class, 'agentsUsersInterested']);
Route::get('/agent/message/messages', [MessageController::class, 'agentsUserMessages']);
Route::get('/user/message/messages', [MessageController::class, 'userMessages']);
Route::get('/user/message/notifier', [MessageController::class, 'messageNotifier']);
Route::post('/user/message/resolve', [MessageController::class, 'resolveMessage']);
Route::post('/message/read', [MessageController::class, 'readMessage']);
