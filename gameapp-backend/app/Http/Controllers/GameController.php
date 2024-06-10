<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Platform;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    public function addGame(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'img' => 'required|image|max:2048',
            'link' => 'required|url',
            'platforms' => 'required|array',
            'platforms.*' => 'exists:platforms,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
        ]);

        $game = new Game;
        $game->name = $request->input('name');
        $game->description = $request->input('description');
        $game->img_path = $request->file('img')->store('gamesimg');
        $game->link = $request->input('link');
        $game->save();

        $game->platforms()->sync($request->input('platforms'));
        $game->categories()->sync($request->input('categories'));

        return response()->json($game, 201);
    }

    public function list()
{
    $games = Game::with(['platforms', 'categories'])->get()->map(function ($game) {
        
        return $game;
    });
    
    return response()->json($games, 200);
}

    public function delete($id)
    {
        $game = Game::find($id);
        if ($game) {
            Storage::delete($game->img_path);
            $game->delete();
            return response()->json(['result' => 'Game has been deleted'], 200);
        } else {
            return response()->json(['result' => 'Operation Failed'], 404);
        }
    }

    public function getGame($id)
    {
        $game = Game::with(['platforms', 'categories'])->find($id);
        if ($game) {
            return response()->json($game, 200);
        } else {
            return response()->json(['error' => 'Game not found'], 404);
        }
    }

    public function updateGame(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url',
            'img' => 'nullable|image|max:2048',
            'platforms' => 'required|array',
            'platforms.*' => 'exists:platforms,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
        ]);

        $game = Game::find($id);
        if (!$game) {
            return response()->json(['error' => 'Game not found'], 404);
        }

        $game->name = $request->input('name');
        $game->description = $request->input('description');
        $game->link = $request->input('link');

        if ($request->hasFile('img')) {
            Storage::delete($game->img_path);
            $game->img_path = $request->file('img')->store('gamesimg');
        }

        $game->save();

        $game->platforms()->sync($request->input('platforms'));
        $game->categories()->sync($request->input('categories'));

        return response()->json($game, 200);
    }

    public function search(Request $request)
    {
        $key = $request->input('key');
        $games = Game::where('name', 'like', "%{$key}%")->with(['platforms', 'categories'])->get();
        return response()->json($games);
    }


    public function filterByPlatform(Request $request)
{
    try {
        $platformId = $request->input('platform_id');
        if (!$platformId) {
            return response()->json(['error' => 'Platform ID is required'], 400);
        }

        $games = Game::whereHas('platforms', function ($query) use ($platformId) {
            $query->where('platforms.id', $platformId);  // Specify the table name
        })->with(['platforms', 'categories'])->get();

        return response()->json($games, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
    }
}

    public function filterByCategory(Request $request)
    {
        try {
            $categoryId = $request->input('category_id');
            if (!$categoryId) {
                return response()->json(['error' => 'Category ID is required'], 400);
            }
    
            $games = Game::whereHas('categories', function ($query) use ($categoryId) {
                $query->where('categories.id', $categoryId);  // Specify the table name
            })->with(['platforms', 'categories'])->get();
    
            return response()->json($games, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }
    
    
    




}
