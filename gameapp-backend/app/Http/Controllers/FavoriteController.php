<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Game;
use App\Models\Emulator;

class FavoriteController extends Controller
{
    public function addFavorite(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'game_id' => 'nullable|exists:games,id',
            'emulator_id' => 'nullable|exists:emulators,id',
        ]);

        Favorite::create($data);

        return response()->json(['message' => 'Added to favorites'], 201);
    }

    public function removeFavorite($id)
    {
        $favorite = Favorite::find($id);

        if (!$favorite) {
            return response()->json(['message' => 'Favorite not found'], 404);
        }

        $favorite->delete();

        return response()->json(['message' => 'Removed from favorites'], 200);
    }

    public function getFavorites(Request $request)
{
    $userId = $request->query('user_id');

    $favorites = Favorite::where('user_id', $userId)->get();

    $result = [];
    foreach ($favorites as $favorite) {
        if ($favorite->game_id) {
            $result[] = [
                'id' => $favorite->id,
                'name' => $favorite->game->name,
                'type' => 'Game',
                'image' => $favorite->game->img_path,
            ];
        } elseif ($favorite->emulator_id) {
            $result[] = [
                'id' => $favorite->id,
                'name' => $favorite->emulator->name,
                'type' => 'Emulator',
                'image' => $favorite->emulator->image,
            ];
        }
    }

    return response()->json($result);
}
}
