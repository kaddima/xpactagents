<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\UserActionController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\AdmsController;
use Illuminate\Support\Facades\DB;

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

Route::get('/forgot-password', [PasswordResetController::class, 'showforgetpasswordform']);
Route::post('/forgot-password', [PasswordResetController::class, 'submitforgetpasswordform']);
//Route::get('/reset-password/{token}',[PasswordResetController::class,'showResetPasswordForm'])->name('resetpassword.get');
Route::post('/reset-password', [PasswordResetController::class, 'submitResetPasswordForm']);
Route::post('/change-password', [PasswordResetController::class, 'changePassword']);

Route::post('/resend-verification-email', [EmailVerificationController::class, 'ResendEmail']);
Route::post('/verify-email-token', [EmailVerificationController::class, 'verifyEmailToken']);


Route::post('/signin', [LoginController::class, 'store']);
Route::post('/create-account', [RegisterController::class, 'store']);
Route::get('/logout', [LoginController::class, 'logout']);

Route::get('/logged-user', function () {

	if (Auth::check()) {

		if (Auth::viaRemember() && Auth::user()->is_agent == 1) {

			return json_encode(['redirect' => true]);
		}

		$favorites = DB::table('favorites')->where('user_id', Auth::user()->id)->get();
		return json_encode(['userInfo' => Auth::user(), 'favorites' => $favorites]);
	}

	return json_encode(['userInfo' => [], 'favorites' => []]);
});

Route::get('/app/{path?}', function () {

	return view('app.main');
})->where('path', '.*');


Route::middleware("auth")->group(function () {
	//===== PROPERTIES ROUTE =====
	Route::Post('/property/delete', [ListingController::class, 'deleteProperty']);
	Route::Post('/property/favorite', [ListingController::class, 'favorite']);
	Route::get('/property/favorites', [ListingController::class, 'getFavorites']);
	Route::get('/property/listings/search', [ListingController::class, 'searchProperty']);
	Route::post('/properties/{id}/images', [ListingController::class, 'uploadPropertyImage']);
	Route::delete('/properties/{id}/images', [ListingController::class, 'deletePropertyImage']);
	Route::put('/properties/{id}', [ListingController::class, 'updateProperty']);
	Route::Post('/properties/{id}/published/{status}', [ListingController::class, 'publishProperty']);

	//===== SPECIFIC AGENT ROUTES =====
	Route::get('/agents/properties', [ListingController::class, 'agentListings']);
	Route::get('/agent/property/listings/search', [ListingController::class, 'agentSearchProperty']);
	Route::get('/agents/properties/{id}', [ListingController::class, 'agentPropertyDetails']);

	Route::get('/agents/general-data', [AccountController::class, 'generalAgentData']);
	Route::post('/dashboard/user-action', [UserActionController::class, 'store']);
	Route::post('/dashboard/appointments/resolve', [UserActionController::class, 'resolveAppointments']);
	Route::post('/dashboard/create-account', [AccountController::class, 'createAccount']);
	Route::post('/dashboard/listings', [ListingController::class, 'listings']);

	Route::post('/dashboard/add-property', [ListingController::class, 'createProperty']);
	
	Route::post('/dashboard/create-property', [ListingController::class, 'createProperty']);
	Route::post('/dashboard/property-listings', [ListingController::class, 'propertyListings']);
	Route::get('/dashboard/property/category', [ListingController::class, 'PropertyByCategory']);
	Route::post('/dashboard/get-latest-properties', [ListingController::class, 'latestProperty']);
	Route::post('/dashboard/property/user-action', [ListingController::class, 'userAction']);



	Route::get('/tours/agent/all', [TourController::class, 'getAgentTour']);
	Route::post('/tours/add', [TourController::class, 'store']);
	Route::post('/tours/resolve', [TourController::class, 'resolveTour']);

	Route::get('/users/search', [AccountController::class, 'searchUser']);
	Route::post('/update-last-seen', [AccountController::class, 'updateLastSeen']);
	Route::post('/users/update', [UserActionController::class, 'updateUser']);
	Route::post('/users/delete', [UserActionController::class, 'deleteUser']);
	Route::post('/users/block', [UserActionController::class, 'blockUser']);
	Route::post('/users/upload-photo', [UserActionController::class, 'uploadPhoto']);
	Route::post('/users/id-verification', [UserActionController::class, 'verifyIdentification']);

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

		if ((auth()->check()  && auth()->user()['is_agent'] == 1) || (auth()->check() && auth()->user()['is_admin'] == 1)) {

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

Route::get('/properties', [ListingController::class, 'getProperties']);
Route::get('/properties/{id}', [ListingController::class, 'propertyDetails']);;

