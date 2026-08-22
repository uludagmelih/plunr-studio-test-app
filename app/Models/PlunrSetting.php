<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlunrSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    public static function valueFor(string $key, array $default = []): array
    {
        return static::query()->where('key', $key)->first()?->value ?? $default;
    }

    public static function putValue(string $key, array $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
