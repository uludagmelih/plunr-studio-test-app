<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlunrEmailTemplate extends Model
{
    protected $fillable = [
        'name', 'key', 'module', 'subject', 'body_html', 'variables', 'is_active', 'is_default',
    ];

    protected function casts(): array
    {
        return [
            'variables' => 'array',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ];
    }
}
