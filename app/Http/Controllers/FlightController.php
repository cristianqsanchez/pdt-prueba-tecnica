<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FlightController extends Controller
{
    public function getFlights(Request $request)
    {
        $request->validate([
            'searchs'                   => 'required|integer',
            'qtyPassengers'             => 'required|integer',
            'adult'                     => 'required|integer',
            'itinerary'                 => 'required|array',
            'itinerary.*.departureCity' => 'required|string',
            'itinerary.*.arrivalCity'   => 'required|string',
            'itinerary.*.hour'          => 'required|date'
        ]);

        try {
            $response = Http::post('https://staging.travelflight.aiop.com.co/api/flights', $request->all());

            if ($response->failed()) {
                return response()->json(['error' => 'Error fetching flights'], 500);
            }

            $flights = $response->json();

            if (isset($flights['data']['Seg1'])) {
                $flightsData = $flights['data']['Seg1'];
                return response()->json($flightsData, 200);
            } else {
                return response()->json(['error' => 'Flights data not found'], 404);
            }

        } catch(\Exception) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
