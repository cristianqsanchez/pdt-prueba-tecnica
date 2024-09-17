<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AirportController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\ReserveController;

Route::post('/airports', [AirportController::class, 'getAirportsByCode']);
Route::post('/flights', [FlightController::class, 'getFlights']);
Route::post('/reserves', [ReserveController::class, 'store']);
