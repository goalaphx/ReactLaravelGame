<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
}
