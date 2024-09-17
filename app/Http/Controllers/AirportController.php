<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AirportController extends Controller
{
    /**
     * @OA\Post(
     *     path="/airports",
     *     summary="Get Airports by City",
     *     description="Fetches a list of airports based on the provided city.",
     *     operationId="getAirportsByCode",
     *     tags={"Airports"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"code"},
     *                 @OA\Property(
     *                     property="code",
     *                     description="Airport code",
     *                     type="string",
     *                     example="New York"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 properties={
     *                     @OA\Property(property="code", type="string", example="JFK"),
     *                     @OA\Property(property="name", type="string", example="John F. Kennedy International Airport"),
     *                     @OA\Property(property="city", type="string", example="New York"),
     *                     @OA\Property(property="country", type="string", example="USA")
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Validation Error")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Error fetching airports")
     *         )
     *     )
     * )
     */
    public function getAirportsByCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $cacheKey = $this->generateCacheKey($request);

        $airports = Cache::remember($cacheKey, 10080, function () use ($request) {
            $response = Http::post('https://staging.travelflight.aiop.com.co/api/airports?code=' . $request->code);

            if ($response->failed()) {
                return response()->json(['error' => 'Error fetching airports'], 500);
            }

            return $response->json();
        });

        try {
            return response()->json($airports, 200);
        } catch (\Exception) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    private function generateCacheKey(Request $request)
    {
        return md5(json_encode($request->all()));
    }
}

