<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Game;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function addEvent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'logo' => 'required|image|max:2048',
            'link' => 'required|url',
            'game_id' => 'required|exists:games,id',
        ]);

        $event = new Event;
        $event->name = $request->input('name');
        $event->description = $request->input('description');
        $event->logo = $request->file('logo')->store('eventslogo');
        $event->link = $request->input('link');
        $event->game_id = $request->input('game_id');
        $event->save();

        

        return response()->json($event, 201);
    }

    public function list()
    {
        $events = Event::with('game')->get();

        return response()->json($events, 200);
    }

    public function delete($id)
    {
        $event = Event::find($id);
        if ($event) {
            Storage::delete($event->logo);
            $event->delete();
            return response()->json(['result' => 'Event has been deleted'], 200);
        } else {
            return response()->json(['result' => 'Operation Failed'], 404);
        }
    }

    public function getEvent($id)
    {
        $event = Event::with('game')->find($id);
        if ($event) {
            return response()->json($event, 200);
        } else {
            return response()->json(['error' => 'Event not found'], 404);
        }
    }

    public function updateEvent(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url',
            'logo' => 'nullable|image|max:2048',
            'game_id' => 'required|exists:games,id',
        ]);

        $event = Event::find($id);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $event->name = $request->input('name');
        $event->description = $request->input('description');
        $event->link = $request->input('link');
        $event->game_id = $request->input('game_id');

        if ($request->hasFile('logo')) {
            Storage::delete($event->logo);
            $event->logo_path = $request->file('logo')->store('eventslogo');
        }

        $event->save();

        return response()->json($event, 200);
    }

    public function search($key)
    {
        return Event::with('game')
            ->where('name', 'Like', "%$key%")
            ->orWhere('description', 'Like', "%$key%")
            ->get();
    }
}
