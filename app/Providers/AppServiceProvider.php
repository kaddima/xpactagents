<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register()
	{
		//
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		return $this->configureRateLimiting();
	}

	protected function configureRateLimiting()
	{
		RateLimiter::for('login', function ($request) {
			return Limit::perMinute(3)->by($request->ip());
		});
	}
}
