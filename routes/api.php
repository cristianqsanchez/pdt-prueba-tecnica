<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AirportController;
use App\Http\Controllers\FlightController;

Route::post('/airports', [AirportController::class, 'getAirportsByCode']);
Route::post('/flights', [FlightController::class, 'getFlights']);
