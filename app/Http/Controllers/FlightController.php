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

            return response()->json($flights, 200);
        } catch(\Exception) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
