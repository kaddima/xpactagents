<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AccountController;
use App\Http\Controllers\Web\ListingController;
use App\Http\Controllers\Web\TourController;
use App\Http\Controllers\Web\MessageController;
use App\Http\Controllers\AdmsController;
use App\Http\Controllers\Web\AdminUserController;
use App\Http\Controllers\Web\AuthenticationController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

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

Route::post('/tours', [TourController::class, 'addNewTour']);

Route::middleware("auth")->group(function () {
	//===== AccountCOntroller =====
	Route::post('/change-password', [AccountController::class, 'changePassword']);
	Route::post('/users/update', [AccountController::class, 'updateUser']);
	Route::put('/users/complete-profile', [AccountController::class, 'completeUserProfile']);
	Route::post('/users/lastseen', [AccountController::class, 'updateLastSeen']);
	Route::post('/users/image', [AccountController::class, 'uploadPhoto']);
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

		// ===== AGENT TOURS
		Route::get("/tours", [TourController::class, "agentTours"]);
		Route::patch("tours/{tour_id}", [TourController::class, "resolveTour"]);
		Route::post('/users/id-verification', [AccountController::class, 'idVerifyRequest']);
	});

	//ADMIN LINKS
	Route::middleware(["auth", "admin"])->group(function () {
		// ===== ADMIN PROPERTIES
		Route::get('/admin/properties/overview', [ListingController::class, 'adminOverviewData']);
		Route::get('/admin/properties', [ListingController::class, 'adminAllListings']);
		Route::get('/admin/properties/{id}', [ListingController::class, 'adminPropertyDetails']);
		Route::get('/admin/agents/{agent_id}/properties', [ListingController::class, 'adminAgentListings']);
		Route::get('/admin/agents/{agent_id}/overview', [ListingController::class, 'adminAgentOverview']);
		Route::get('/admin/agents/{agent_id}/tours', [TourController::class, 'agentTours']);
		Route::get('/admin/agents/{agent_id}/messages/poi', [MessageController::class, 'agentsPropertyOfInterest']);
		Route::get('/admin/agents/{agent_id}/properties/{id}/conversations', [MessageController::class, 'getAgentPropertyConversations']);
		Route::get('/admin/agents/{agent_id}/conversations/{id}/messages', [MessageController::class, 'getAgentMessages']);

		Route::get('/admin/users/overview', [AdminUserController::class, 'adminUsersOverview']);
		Route::get('/admin/users', [AdminUserController::class, 'getUsers']);
		Route::get('/admin/users/search', [AdminUserController::class, 'searchUsers']);

		Route::get('/admin/users/verification-request', [AdminUserController::class, 'verificationRequest']);
		Route::post('/admin/users/verification/verify', [AdminUserController::class, 'idVerificationAccept']);
		Route::post('/admin/users/verification/deny', [AdminUserController::class, 'idVerificationDecline']);
		Route::get('/admin/users/{user_id}', [AdminUserController::class, 'getUserDetails']);
		Route::delete('/admin/users/{user_id}', [AdminUserController::class, 'deleteUser']);
		Route::post('/users/{user_id}/block', [AdminUserController::class, 'blockUser']);
		Route::post('/users/{user_id}/unblock', [AdminUserController::class, 'unblockUser']);

		//ADMS LINK
		Route::get('/adms/overview', [AdmsController::class, 'admsOverview']);
		Route::get('/adms/users', [AdmsController::class, 'admsUsers']);
		Route::get('/adms/admins', [AdmsController::class, 'admsAdmins']);
		Route::post('/adms/create-admin', [AdmsController::class, 'admsCreateAdmin']);
		Route::post('/adms/make-admin', [AdmsController::class, 'admsMakeAdmin']);
	});
});

Route::get('/dashboard/{path?}', function () {
	if ((auth()->check()  && auth()->user()['is_agent'] == 1)
		|| (auth()->check() && auth()->user()['is_admin'] == 1)
	) {
		return view('app.dashboard');
	}
	return redirect('/');
})->where('path', '.*');

Route::get('/admins/{path?}', function () {
	if (auth()->check()  && auth()->user()['is_admin'] == 1) {
		return view('app.admin_dashboard');
	}
	return redirect('/');
})->where('path', '.*');
Route::view('/app/{path?}', 'app.main')->where('path', '.*');

Route::get('/properties', [ListingController::class, 'getProperties']);
Route::get('/properties/search', [ListingController::class, 'getProperties']);
Route::get('/properties/{id}', [ListingController::class, 'propertyDetails']);

Route::get('/clear-cache', function () {
	Artisan::call('cache:clear');
	Artisan::call('route:clear');

	return 'clear';
});

//since symlink wont work for shared hosting we improvise
if (env('ENABLE_STORAGE_ROUTE', false)) {
	Route::get('/storage/{path}', function ($path) {
		$fullPath = storage_path("app/public/{$path}");

		if (
			!File::exists($fullPath) ||
			!str_starts_with(realpath($fullPath), realpath(storage_path('app/public')))
		) {
			abort(404);
		}

		return Response::file($fullPath, [
			'Cache-Control' => 'public, max-age=86400',
		]);
	})->where('path', '.*');
}

//this should run basic setups like migration and seeding
Route::get('/basic/setup', function () {
	Artisan::call("migrate");
	Artisan::call("db:seed");

	return "Migration and seeding successful";
});
