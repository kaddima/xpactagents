<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
  /**
   * A list of the exception types that are not reported.
   *
   * @var array<int, class-string<Throwable>>
   */
  protected $dontReport = [
    //
  ];

  /**
   * A list of the inputs that are never flashed for validation exceptions.
   *
   * @var array<int, string>
   */
  protected $dontFlash = [
    'current_password',
    'password',
    'password_confirmation',
  ];

  /**
   * Register the exception handling callbacks for the application.
   *
   * @return void
   */
  public function register()
  {
    $this->reportable(function (Throwable $e) {
      // Log specific exceptions
      if ($e instanceof AuthenticationException) {
        Log::info('Authentication exception: ' . $e->getMessage());
      }

      if ($e instanceof AuthorizationException) {
        Log::debug('Authorization exception: ' . $e->getMessage());
      }

      if ($e instanceof ValidationException) {
        Log::warning('Validation exception: ' . json_encode($e->validator->errors()));
      }

      if ($e instanceof ModelNotFoundException) {
        Log::warning('Model not found exception: ' . $e->getMessage());
      }
    });
  }


  public function render($request, Throwable $exception): JsonResponse | Response
  {
    if ($request->expectsJson()) {
      if ($exception instanceof AuthenticationException) {
        return response()->json([
          'data' => null,
          'status' => false,
          'error' => 'Authentication Error',
          'message' => $exception->getMessage(),
        ], 401);
      }

      if ($exception instanceof AuthorizationException) {
        return response()->json([
          'data' => null,
          'status' => false,
          'error' => 'Authorization Error',
          'message' => $exception->getMessage(),
        ], 403);
      }
      if ($exception instanceof ValidationException) {
        return response()->json([
          'data' => null,
          'status' => false,
          'error' => 'Validation Error',
          'messages' => $exception->validator->errors(),
        ], 422);
      }
      if ($exception instanceof ModelNotFoundException ||  $exception instanceof NotFoundException) {
        return response()->json([
          'data' => null,
          'status' => false,
          'error' => 'Record Not Found',
          'messages' => $exception->getMessage(),
        ], 404);
      }

      return response()->json([
        'data' => null,
        'status' => false,
        'error' => 'Server Error',
        'message' => 'An unexpected error occurred: '.$exception->getMessage() .'Line: '.$exception->getLine(),
      ], 500);
    }

    return parent::render($request, $exception);
  }
}
