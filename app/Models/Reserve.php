<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserve extends Model
{
    use HasFactory;

    protected $fillable = ['origin', 'destination', 'departure_time'];

    public function itineraries()
    {
        return $this->hasMany(Itinerary::class);
    }
}

