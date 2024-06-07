<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    //
    function register(Request $request)
    {
        $user = new User;
        $user->name = $request->input('name');
        $user->roles = $request->input('roles'); // Assuming roles are passed as comma-separated string, if not, adjust accordingly
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));
        $user->profilepic = $request->input('profilepic');
        $user->email_verified_at = now(); // Assuming email verification is immediate upon registration
        $user->save();
        return $user;
    }
    
    function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return ["error" => "Email or Password Incorrect"];
        }
        return $user;
    }
    public function getUser($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }
    return response()->json($user);
}
public function updateProfilePic(Request $request)
{
    $request->validate([
        'profilepic' => 'required|image|max:2048',
        'user_id' => 'required|integer',
    ]);

    $user = User::find($request->input('user_id'));

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    if ($request->hasFile('profilepic')) {
        // Get the original file name
        $originalFileName = $request->file('profilepic')->getClientOriginalName();

        // Store the new profile picture with the original file name
        $filename = time() . '_' . $originalFileName;
        $request->file('profilepic')->storeAs('profile_pics', $filename);

        // Update the user's profilepic field with the new filename
        $user->profilepic = $filename;
        $user->save();
    }

    return response()->json($user);
}
 // List all users
 public function listUsers()
 {
     $users = User::all();
     return response()->json($users);
 }

 // Update user's role
 public function updateUserRole(Request $request, $id)
 {
     $request->validate([
         'roles' => 'required|string',
     ]);

     $user = User::find($id);
     if (!$user) {
         return response()->json(['error' => 'User not found'], 404);
     }

     $user->roles = $request->input('roles');
     $user->save();

     return response()->json($user);
 }

 // Delete a user
 public function deleteUser($id)
 {
     $user = User::find($id);
     if (!$user) {
         return response()->json(['error' => 'User not found'], 404);
     }

     $user->delete();
     return response()->json(['message' => 'User deleted successfully']);
 }
}