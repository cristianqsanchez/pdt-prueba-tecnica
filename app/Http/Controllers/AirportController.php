<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AirportController extends Controller
{
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
