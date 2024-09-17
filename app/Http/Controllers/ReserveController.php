<?php

namespace App\Http\Controllers;

use App\Models\Reserve;
use Illuminate\Http\Request;

class ReserveController extends Controller
{
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
