<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    use HasFactory;

    protected $fillable = ['reserve_id', 'origin', 'destination', 'departure_time', 'arrival_time'];

    public function reserve()
    {
        return $this->belongsTo(Reserve::class);
    }
}
