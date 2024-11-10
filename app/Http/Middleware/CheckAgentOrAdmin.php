<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class CheckAgentOrAdmin
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
   * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
   */
  public function handle(Request $request, Closure $next)
  {
 
     // Get the authenticated user
    $user = Auth::user();

    // Check if the user is an agent or admin
    if ($user->is_agent == 1 || $user->is_admin == 1) {
      return $next($request);
    }

    // If not authorized, return a 403 Forbidden response
    return response()->json(['message' => 'Forbidden: operation for agent accounts'], 403);
  }
}
