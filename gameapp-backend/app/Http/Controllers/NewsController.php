<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Favorite;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function list()
    {
        $news = News::with(['game', 'emulator'])->get();
        return response()->json($news, 200);
    }

    public function getNews($id)
    {
        $news = News::with(['game', 'emulator'])->find($id);
        if ($news) {
            return response()->json($news, 200);
        } else {
            return response()->json(['error' => 'News not found'], 404);
        }
    }

    public function addNews(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'game_id' => 'nullable|exists:games,id',
            'emulator_id' => 'nullable|exists:emulators,id'
        ]);

        $news = new News;
        $news->title = $request->input('title');
        $news->content = $request->input('content');
        if ($request->hasFile('image')) {
            $news->image_path = $request->file('image')->store('news_images');
        }
        $news->game_id = $request->input('game_id');
        $news->emulator_id = $request->input('emulator_id');
        $news->save();

        // Generate notifications for users with this game or emulator in favorites
        $gameId = $request->input('game_id');
        $emulatorId = $request->input('emulator_id');

        if ($gameId) {
            $favoriteUsers = Favorite::where('game_id', $gameId)->pluck('user_id');
        } elseif ($emulatorId) {
            $favoriteUsers = Favorite::where('emulator_id', $emulatorId)->pluck('user_id');
        } else {
            $favoriteUsers = collect();
        }

        foreach ($favoriteUsers as $userId) {
            $message = "Check out the news about: " . ($news->game ? $news->game->name : $news->emulator->name);
            Notification::create([
                'user_id' => $userId,
                'message' => $message,
            ]);
        }

        return response()->json($news, 201);
    }

    public function updateNews(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'game_id' => 'nullable|exists:games,id',
            'emulator_id' => 'nullable|exists:emulators,id'
        ]);

        $news = News::find($id);
        if (!$news) {
            return response()->json(['error' => 'News not found'], 404);
        }

        $news->title = $request->input('title');
        $news->content = $request->input('content');
        if ($request->hasFile('image')) {
            Storage::delete($news->image_path);
            $news->image_path = $request->file('image')->store('news_images');
        }
        $news->game_id = $request->input('game_id');
        $news->emulator_id = $request->input('emulator_id');
        $news->save();

        return response()->json($news, 200);
    }

    public function deleteNews($id)
    {
        $news = News::find($id);
        if ($news) {
            Storage::delete($news->image_path);
            $news->delete();
            return response()->json(['result' => 'News has been deleted'], 200);
        } else {
            return response()->json(['error' => 'News not found'], 404);
        }
    }

    public function searchNews($key)
    {
        return News::with(['game', 'emulator'])
            ->where('title', 'LIKE', "%$key%")
            ->orWhere('content', 'LIKE', "%$key%")
            ->get();
    }
}
