<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlunrCurrency extends Model
{
    protected $fillable = ['name', 'code', 'symbol', 'status', 'notes'];
}
