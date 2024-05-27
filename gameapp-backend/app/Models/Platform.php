<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    use HasFactory;
    public function games()
    {
        return $this->belongsToMany(Game::class, 'game_platform');
    }

    public function emulators()
    {
        return $this->belongsToMany(Emulator::class, 'emulator_platform');
    }
}
