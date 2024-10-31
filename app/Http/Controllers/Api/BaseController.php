<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseController extends Controller
{
	/**
	 * Sends back response with data
	 */
	protected function sendResponse($data = null, $message = '', $status = true): JsonResponse
	{
		return response()->json([
			'data' => $data,
			'status' => $status,
			'error' => !$status,
			'message' => $message,
		]);
	}

	/**
	 * respond with resource or resource collection
	 */
	protected function sendResourceResponse(JsonResource $resource, $message = '', $status = true): JsonResponse
	{
		return $this->sendResponse($resource, $message, $status);
	}

	/**
	 * returns an error response to the client
	 */
	protected function sendError($errors, $statusCode = 401): JsonResponse
	{
		return response()->json([
			'data' => null,
			'status' => false,
			'error' => $errors,
			'message' => null,
		], $statusCode);
	}
}
