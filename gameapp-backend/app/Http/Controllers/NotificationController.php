<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Game;
use App\Models\Emulator;
use App\Models\Event;
use App\Models\News;

class NotificationController extends Controller
{
    public function getNotifications(Request $request)
    {
        $userId = $request->query('user_id');

        // Get user's favorite games and emulators
        $favoriteGames = Favorite::where('user_id', $userId)->whereNotNull('game_id')->pluck('game_id');
        $favoriteEmulators = Favorite::where('user_id', $userId)->whereNotNull('emulator_id')->pluck('emulator_id');

        // Fetch news related to favorite games and emulators
        $gameNews = News::whereIn('game_id', $favoriteGames)->get();
        $emulatorNews = News::whereIn('emulator_id', $favoriteEmulators)->get();

        // Fetch events related to favorite games
        $gameEvents = Event::whereIn('game_id', $favoriteGames)->get();

        // Combine all notifications
        $notifications = $gameNews->concat($emulatorNews)->concat($gameEvents);

        return response()->json($notifications);
    }
}

