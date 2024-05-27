<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emulator extends Model
{
    use HasFactory;

    public function platforms()
    {
        return $this->belongsToMany(Platform::class, 'emulator_platform');
    }
}
