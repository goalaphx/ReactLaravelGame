<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'img_path', 'link'];
    public function platforms()
    {
        return $this->belongsToMany(Platform::class, 'game_platform');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'game_category');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}

