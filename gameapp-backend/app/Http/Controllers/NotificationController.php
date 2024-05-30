<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request, $userId)
    {
        // Retrieve notifications for the specified user ID
        $notifications = Notification::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        
        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        // Mark the notification as read
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->read_status = true;
        $notification->save();

        return response()->json(['message' => 'Notification marked as read'], 200);
    }

    public function destroy(Request $request, $id)
    {
        // Delete the notification
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully'], 200);
    }
}
