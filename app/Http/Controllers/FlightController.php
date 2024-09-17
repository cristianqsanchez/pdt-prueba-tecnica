<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FlightController extends Controller
{
    /**
     * @OA\Post(
     *     path="/flights",
     *     summary="Get Flights",
     *     description="Fetches a list of flights based on search parameters.",
     *     operationId="getFlights",
     *     tags={"Flights"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"searchs", "qtyPassengers", "adult", "itinerary"},
     *                 @OA\Property(
     *                     property="searchs",
     *                     description="Number of searches",
     *                     type="integer",
     *                     example=1
     *                 ),
     *                 @OA\Property(
     *                     property="qtyPassengers",
     *                     description="Quantity of passengers",
     *                     type="integer",
     *                     example=2
     *                 ),
     *                 @OA\Property(
     *                     property="adult",
     *                     description="Number of adults",
     *                     type="integer",
     *                     example=2
     *                 ),
     *                 @OA\Property(
     *                     property="itinerary",
     *                     description="List of itinerary segments",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         required={"departureCity", "arrivalCity", "hour"},
     *                         @OA\Property(
     *                             property="departureCity",
     *                             description="City of departure",
     *                             type="string",
     *                             example="JFK"
     *                         ),
     *                         @OA\Property(
     *                             property="arrivalCity",
     *                             description="City of arrival",
     *                             type="string",
     *                             example="LAX"
     *                         ),
     *                         @OA\Property(
     *                             property="hour",
     *                             description="Date and time of the flight",
     *                             type="string",
     *                             format="date-time",
     *                             example="2024-09-18T10:30:00Z"
     *                         )
     *                     )
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
     *                     @OA\Property(property="dateOfDeparture", type="string", format="date", example="2024-09-18"),
     *                     @OA\Property(property="timeOfDeparture", type="string", format="time", example="10:30:00"),
     *                     @OA\Property(property="dateOfArrival", type="string", format="date", example="2024-09-18"),
     *                     @OA\Property(property="timeOfArrival", type="string", format="time", example="13:30:00"),
     *                     @OA\Property(property="marketingCarrier", type="string", example="AA"),
     *                     @OA\Property(property="companyName", type="string", example="American Airlines"),
     *                     @OA\Property(property="flightOrtrainNumber", type="string", example="AA123"),
     *                     @OA\Property(
     *                         property="locationId",
     *                         type="object",
     *                         properties={
     *                             @OA\Property(property="departureCity", type="string", example="JFK"),
     *                             @OA\Property(property="arrivalCity", type="string", example="LAX")
     *                         }
     *                     )
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
     *         response=404,
     *         description="Flights data not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Flights data not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Error fetching flights")
     *         )
     *     )
     * )
     */
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
                    'companyName'         => $segment['companyName'],
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

