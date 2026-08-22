<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlunrCountry extends Model
{
    protected $fillable = ['name', 'country_code', 'currency', 'status', 'notes'];
}
