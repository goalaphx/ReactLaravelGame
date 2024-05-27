<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'game_id', 'description', 'logo', 'link'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
