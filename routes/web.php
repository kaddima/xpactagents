<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AccountController;
use App\Http\Controllers\Web\ListingController;
use App\Http\Controllers\UserActionController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\Web\MessageController;
use App\Http\Controllers\AdmsController;
use App\Http\Controllers\Web\AuthenticationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'app.main');
Route::view('/terms-and-condition', 'terms');
Route::view('/contact-us', 'contact-us');

// Authentication route
Route::controller(AuthenticationController::class)->group(function () {
	Route::post("login", "login")->middleware("throttle:login");
	Route::post('/register', "register");
	Route::post('/register/resend-otp', "resendOTPEmail");
	Route::post('/register/verify-email', "verifyEmail");
	Route::post('/password/send-reset-token', 'sendPasswordResetToken');
	Route::post('/password/reset', 'resetPassword');
	Route::post("/logout", "logout");
});

// check if the user is still logged
Route::get('/users/verify/authentication', [AccountController::class, "verifyAuthentication"]);

Route::middleware("auth")->group(function () {
	//===== AccountCOntroller =====
	Route::post('/change-password', [AccountController::class, 'changePassword']);

	//===== PROPERTIES ROUTE =====
	Route::get('/properties/favorites', [ListingController::class, 'getFavorites']);
	Route::post('/properties/{id}/favorite', [ListingController::class, 'addFavorite']);
	Route::delete('/properties/{id}/favorite', [ListingController::class, 'removeFavorite']);
//===== PROPERTY MESSAGES AND CONVERSATIONS =====
	Route::post('/properties/conversations', [MessageController::class, 'createConversation']);
	Route::post('/properties/messages', [MessageController::class, 'sendMessage']);
	Route::get('/properties/conversations', [MessageController::class, 'getUserConversations']);
	Route::post('/properties/conversations/{id}/messages/read', [MessageController::class, 'markMessagesRead']);
	Route::get('/properties/conversations/{id}/messages', [MessageController::class, 'getMessages']);

	Route::middleware(["auth", "agent_or_admin"])->group(function () {
		Route::post('/properties', [ListingController::class, 'createProperty']);
		Route::post('/properties/{id}/images', [ListingController::class, 'uploadPropertyImage']);
		Route::delete('/properties/{id}/images', [ListingController::class, 'deletePropertyImage']);
		Route::put('/properties/{id}', [ListingController::class, 'updateProperty']);
		Route::delete('/properties/{id}', [ListingController::class, 'deleteProperty']);
		Route::Post('/properties/{id}/published/{status}', [ListingController::class, 'publishProperty']);

		//===== AGENT PROPERTY MESSAGES AND CONVERSATIONS =====
		Route::post('/agents/properties/conversation/resolve', [MessageController::class, 'resolveConversation']);
		Route::get('/agents/properties/{id}/conversations', [MessageController::class, 'getPropertyConversations']);
		Route::get('/agent/message/property-of-interest', [MessageController::class, 'agentsPropertyOfInterest']);

		//===== SPECIFIC AGENT ROUTES =====
		Route::get('/agents/properties', [ListingController::class, 'agentListings']);
		Route::get('/agents/properties/search', [ListingController::class, 'agentListings']);
		Route::get('/agents/properties/{id}', [ListingController::class, 'agentPropertyDetails']);
		Route::get('/agents/general-data', [AccountController::class, 'agentOverviewData']);
		Route::post('/dashboard/appointments/resolve', [UserActionController::class, 'resolveAppointments']);
	});

	Route::get('/tours/agent/all', [TourController::class, 'getAgentTour']);
	Route::post('/tours/add', [TourController::class, 'store']);
	Route::post('/tours/resolve', [TourController::class, 'resolveTour']);

	Route::get('/users/search', [AccountController::class, 'searchUser']);
	Route::post('/users/lastseen', [AccountController::class, 'updateLastSeen']);
	Route::post('/users/update', [UserActionController::class, 'updateUser']);
	Route::post('/users/delete', [UserActionController::class, 'deleteUser']);
	Route::post('/users/block', [UserActionController::class, 'blockUser']);
	Route::post('/users/image', [UserActionController::class, 'uploadPhoto']);
	Route::post('/users/id-verification', [UserActionController::class, 'idVerifyRequest']);

	//ADMIN LINKS

	Route::get('/admin/users/overview-data', [AccountController::class, 'adminUsersOverview']);
	Route::get('/admin/users/regular', [AccountController::class, 'adminUsersRegular']);
	Route::get('/admin/users/verification-request', [AccountController::class, 'verificationRequest']);
	Route::post('/admin/users/verification-response', [AccountController::class, 'verificationResponse']);
	Route::get('/admin/users/agent-lists', [AccountController::class, 'adminUsersAgent']);
	Route::get('/admin/users/user-details', [AccountController::class, 'getUserAccount']);
	Route::get('/admin/properties/overview', [ListingController::class, 'adminPropertiesOverview']);
	Route::get('/admin/listings/all', [ListingController::class, 'adminAllListings']);
	Route::get('/admin/agent/listings', [ListingController::class, 'adminAgentListings']);


	//ADMS LINK
	Route::get('/adms/overview', [AdmsController::class, 'admsOverview']);
	Route::get('/adms/users', [AdmsController::class, 'admsUsers']);
	Route::get('/adms/admins', [AdmsController::class, 'admsAdmins']);
	Route::post('/adms/create-admin', [AdmsController::class, 'admsCreateAdmin']);
	Route::post('/adms/make-admin', [AdmsController::class, 'admsMakeAdmin']);

	Route::get('/dashboard/{path?}', function () {
		if ((auth()->check()  && auth()->user()['is_agent'] == 1)
			|| (auth()->check() && auth()->user()['is_admin'] == 1)
		) {
			return view('app.dashboard');
		}
		return redirect('/');
	})->where('path', '.*');

	Route::get('/admin/{path?}', function () {
		if (auth()->check()  && auth()->user()['is_admin'] == 1) {
			return view('app.admin_dashboard');
		}
		return redirect('/');
	})->where('path', '.*');
});

Route::view('/app/{path?}','app.main')->where('path', '.*');

Route::get('/properties', [ListingController::class, 'getProperties']);
Route::get('/properties/search', [ListingController::class, 'getProperties']);
Route::get('/properties/{id}', [ListingController::class, 'propertyDetails']);;
