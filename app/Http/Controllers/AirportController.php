<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AirportController extends Controller
{
    public function getAirportsByCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        try {
            $response = Http::post('https://staging.travelflight.aiop.com.co/api/airports?code=' . $request->code);

            if ($response->failed()) {
                return response()->json(['error' => 'Error fetching airports'], 500);
            }

            $airports = $response->json();

            return response()->json($airports, 200);
        } catch (\Exception) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
