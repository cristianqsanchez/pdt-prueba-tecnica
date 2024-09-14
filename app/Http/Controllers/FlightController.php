<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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

        $cacheKey = $this->generateCacheKey($request);

        $flights = Cache::remember($cacheKey, 1440, function () use ($request) {
            $response = Http::post('https://staging.travelflight.aiop.com.co/api/flights', $request->all());

            if ($response->failed()) {
                return response()->json(['error' => 'Error fetching flights'], 500);
            }

            return $response->json();
        });

        try {
            if (isset($flights['data']['Seg1'])) {
                $flightsData = $flights['data']['Seg1'];
                $formattedFlights = $this->formatFlights($flightsData);
                return response()->json($formattedFlights, 200);
            } else {
                return response()->json(['error' => 'Flights data not found'], 404);
            }
        } catch (\Exception) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    private function formatFlights($flightsData)
    {
        $formattedFlights = [];

        foreach ($flightsData as $flight) {
            foreach ($flight['segments'] as $segment) {
                $formattedFlights[] = [
                    'dateOfDeparture'     => $segment['productDateTime']['dateOfDeparture'],
                    'timeOfDeparture'     => $segment['productDateTime']['timeOfDeparture'],
                    'dateOfArrival'       => $segment['productDateTime']['dateOfArrival'],
                    'timeOfArrival'       => $segment['productDateTime']['timeOfArrival'],
                    'marketingCarrier'    => $segment['companyId']['marketingCarrier'],
                    'flightOrtrainNumber' => $segment['flightOrtrainNumber'],
                    'locationId' => [
                        'departureCity' => $segment['location'][0]['locationId'],
                        'arrivalCity'   => $segment['location'][1]['locationId']
                    ]
                ];
            }
        }

        return $formattedFlights;
    }

    private function generateCacheKey(Request $request)
    {
        return md5(json_encode($request->all()));
    }
}
