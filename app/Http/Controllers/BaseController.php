<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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

	protected function validateParams($data,$rules,$message=[]){
		$validator = Validator::make($data,$rules,$message);

		if($validator->fails()){
			throw new ValidationException($validator);
		}

		return $validator->validated();
	}
}
