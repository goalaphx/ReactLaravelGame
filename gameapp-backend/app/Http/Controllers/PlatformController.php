<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlatformController extends Controller
{
    function addPlatform(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'img' => 'required|image|max:2048' // Image is required
        ]);

        // Create a new platform
        $plat = new Platform;
        $plat->name = $validatedData['name'];
        $plat->image = $request->file('img')->store('platformimg');
        $plat->save();

        return response()->json($plat, 201);
    }

    function listPlatform()
    {
        return Platform::all();
    }

    function deletePlatform($id)
    {
        $plat = Platform::find($id);

        if (!$plat) {
            return response()->json(['error' => 'Platform not found'], 404);
        }

        if ($plat->image) {
            Storage::delete($plat->image);
        }

        $plat->delete();

        return response()->json(['result' => 'Platform has been deleted'], 200);
    }

    function getPlatform($id)
    {
        $plat = Platform::find($id);

        if (!$plat) {
            return response()->json(['error' => 'Platform not found'], 404);
        }

        return response()->json($plat, 200);
    }

    public function updatePlatform(Request $request, $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'img' => 'nullable|image|max:2048' // Image is optional
            ]);

            // Find the platform by ID
            $plat = Platform::find($id);

            // If platform not found, return 404 error
            if (!$plat) {
                return response()->json(['error' => 'Platform not found'], 404);
            }

            // Update platform data
            $plat->name = $validatedData['name'];

            // Check if an image file is provided and store it
            if ($request->hasFile('img')) {
                // Delete the old image if it exists
                if ($plat->image) {
                    Storage::delete($plat->image);
                }

                $plat->image = $request->file('img')->store('platformimg');
            }

            $plat->save();

            // Return the updated platform
            return response()->json($plat, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors
            return response()->json(['error' => 'Validation Error', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            // If any other error occurs, return 500 error
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    function searchPlatform($key)
    {
        return Platform::where('name', 'like', "%$key%")->get();
    }
}
