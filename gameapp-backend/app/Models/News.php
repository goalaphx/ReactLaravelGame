<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'content', 'image_path', 'game_id', 'emulator_id'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function emulator()
    {
        return $this->belongsTo(Emulator::class);
    }
}
