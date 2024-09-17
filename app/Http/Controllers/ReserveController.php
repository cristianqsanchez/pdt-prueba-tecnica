<?php

namespace App\Http\Controllers;

use App\Models\Reserve;
use Illuminate\Http\Request;

/**
 * @OA\Info(title="Flights API", version="1.0")
 * @OA\Server(url="http://localhost:8000/api")
 */
class ReserveController extends Controller
{
    /**
     * @OA\Post(
     *     path="/reservations",
     *     summary="Create a reservation",
     *     description="Stores a new reservation along with itineraries.",
     *     operationId="storeReservation",
     *     tags={"Reservations"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"origin", "destination", "departure_time", "itineraries"},
     *                 @OA\Property(
     *                     property="origin",
     *                     description="Origin location",
     *                     type="string",
     *                     maxLength=255,
     *                     example="JFK"
     *                 ),
     *                 @OA\Property(
     *                     property="destination",
     *                     description="Destination location",
     *                     type="string",
     *                     maxLength=255,
     *                     example="LAX"
     *                 ),
     *                 @OA\Property(
     *                     property="departure_time",
     *                     description="Departure time",
     *                     type="string",
     *                     format="date-time",
     *                     example="2024-09-18T10:30:00Z"
     *                 ),
     *                 @OA\Property(
     *                     property="itineraries",
     *                     description="List of itineraries",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         required={"origin", "destination", "departure_time", "arrival_time"},
     *                         @OA\Property(
     *                             property="origin",
     *                             description="Origin location for itinerary",
     *                             type="string",
     *                             maxLength=255,
     *                             example="JFK"
     *                         ),
     *                         @OA\Property(
     *                             property="destination",
     *                             description="Destination location for itinerary",
     *                             type="string",
     *                             maxLength=255,
     *                             example="LAX"
     *                         ),
     *                         @OA\Property(
     *                             property="departure_time",
     *                             description="Departure time for itinerary",
     *                             type="string",
     *                             format="date-time",
     *                             example="2024-09-18T10:30:00Z"
     *                         ),
     *                         @OA\Property(
     *                             property="arrival_time",
     *                             description="Arrival time for itinerary",
     *                             type="string",
     *                             format="date-time",
     *                             example="2024-09-18T13:30:00Z"
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Reservation created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             properties={
     *                 @OA\Property(property="reserve", type="object",
     *                     properties={
     *                         @OA\Property(property="origin", type="string", example="JFK"),
     *                         @OA\Property(property="destination", type="string", example="LAX"),
     *                         @OA\Property(property="departure_time", type="string", format="date-time", example="2024-09-18T10:30:00Z"),
     *                         @OA\Property(property="itineraries", type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 properties={
     *                                     @OA\Property(property="origin", type="string", example="JFK"),
     *                                     @OA\Property(property="destination", type="string", example="LAX"),
     *                                     @OA\Property(property="departure_time", type="string", format="date-time", example="2024-09-18T10:30:00Z"),
     *                                     @OA\Property(property="arrival_time", type="string", format="date-time", example="2024-09-18T13:30:00Z")
     *                                 }
     *                             )
     *                         )
     *                     }
     *                 )
     *             }
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
     *             @OA\Property(property="error", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'departure_time' => 'required|date',
            'itineraries' => 'required|array',
            'itineraries.*.origin' => 'required|string|max:255',
            'itineraries.*.destination' => 'required|string|max:255',
            'itineraries.*.departure_time' => 'required|date',
            'itineraries.*.arrival_time' => 'required|date',
        ]);

        try {
            $reserve = Reserve::create([
                'origin' => $validated['origin'],
                'destination' => $validated['destination'],
                'departure_time' => $validated['departure_time'],
            ]);

            foreach ($validated['itineraries'] as $itinerary) {
                $reserve->itineraries()->create($itinerary);
            }

            return response()->json([
                'reserve' => $reserve->load('itineraries')
            ], 201);
        } catch (\Exception) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
