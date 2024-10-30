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

Route::get('/forgot-password', [PasswordResetController::class, 'showforgetpasswordform']);
Route::post('/forgot-password', [PasswordResetController::class, 'submitforgetpasswordform']);
Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPasswordForm'])->name('resetpassword.get');
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

		return json_encode(['userInfo' => Auth::user()]);
	}

	return json_encode(['userInfo' => []]);
});

Route::get('/app/{path?}', function () {

	return view('app.main');
})->where('path', '.*');


Route::get('/agents/general-data', [AccountController::class, 'generalAgentData']);
Route::post('/dashboard/user-action', [UserActionController::class, 'store']);
Route::post('/dashboard/appointments/resolve', [UserActionController::class, 'resolveAppointments']);
Route::post('/dashboard/create-account', [AccountController::class, 'createAccount']);
Route::post('/dashboard/listings', [ListingController::class, 'listings']);
Route::get('/agent/listings', [ListingController::class, 'agentListings']);
Route::post('/dashboard/add-property', [ListingController::class, 'createProperty']);
Route::post('/dashboard/upload-property-photo', [ListingController::class, 'uploadPropertyImage']);
Route::post('/dashboard/update-property', [ListingController::class, 'updateProperty']);
Route::post('/dashboard/create-property', [ListingController::class, 'createProperty']);
Route::post('/dashboard/property-listings', [ListingController::class, 'propertyListings']);
Route::get('/dashboard/property/category', [ListingController::class, 'PropertyByCategory']);
Route::post('/dashboard/property-details', [ListingController::class, 'propertyDetails']);
Route::post('/dashboard/get-latest-properties', [ListingController::class, 'latestProperty']);
Route::post('/dashboard/property/user-action', [ListingController::class, 'userAction']);
Route::Post('/property/image/delete', [ListingController::class, 'deletePropertyImage']);
Route::Post('/property/delete', [ListingController::class, 'deleteProperty']);
Route::Post('/property/favorite', [ListingController::class, 'favorite']);
Route::get('/property/favorites', [ListingController::class, 'getFavorites']);
Route::get('/property/listings/search', [ListingController::class, 'searchProperty']);
Route::get('/agent/property/listings/search', [ListingController::class, 'agentSearchProperty']);
Route::Post('/property/publish', [ListingController::class, 'publishProperty']);

Route::get('/tours/agent/all', [TourController::class, 'getAgentTour']);
Route::post('/tours/add', [TourController::class, 'store']);
Route::post('/tours/resolve', [TourController::class, 'resolveTour']);

Route::post('/update-last-seen', [AccountController::class, 'updateLastSeen']);
Route::post('/users/update', [UserActionController::class, 'updateUser']);
Route::post('/users/upload-photo', [UserActionController::class, 'uploadPhoto']);

Route::post('/question/send-messge', [MessageController::class, 'store']);
Route::post('/agents/message/send', [MessageController::class, 'saveMessage']);
Route::get('/agent/message/property-of-interest', [MessageController::class, 'agentsPropertyOfInterest']);
Route::get('/users/message/property-of-interest', [MessageController::class, 'usersPropertyOfInterest']);
Route::get('/agent/message/participants', [MessageController::class, 'agentsUsersInterested']);
Route::get('/agent/message/messages', [MessageController::class, 'agentsUserMessages']);
Route::get('/user/message/messages', [MessageController::class, 'userMessages']);

Route::get('/dashboard/{path?}', function () {

	if (auth()->check() && auth()->user()['is_admin'] == 1) {

		return redirect()->intended('/admin/dashboard');
	} elseif (auth()->check()  && auth()->user()['is_agent'] == 1) {

		return view('app.dashboard');
	} else if (auth()->check()) {
		return redirect('/');
	} else {
		return redirect('/');
	}
})->where('path', '.*');
