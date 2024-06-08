<?php

namespace App\Http\Controllers;

use App\Models\Emulator;
use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmuController extends Controller
{
    function addEmulator(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'platform_ids' => 'required|array',
            'platform_ids.*' => 'exists:platforms,id', // Validate platform IDs exist
            'description' => 'required|string',
            'link' => 'required|url',
            'img' => 'required|image|max:2048' // Image is required
        ]);

        // Create a new emulator
        $emu = new Emulator;
        $emu->name = $validatedData['name'];
        $emu->description = $validatedData['description'];
        $emu->link = $validatedData['link'];
        $emu->image = $request->file('img')->store('emuimg');
        $emu->save();

        // Attach the platforms to the emulator
        $emu->platforms()->attach($validatedData['platform_ids']);

        return response()->json($emu->load('platforms'), 201);
    }

    function listEmu()
    {
        return Emulator::with('platforms')->get();
    }

    function deleteEmu($id)
    {
        $emu = Emulator::find($id);

        if (!$emu) {
            return response()->json(['error' => 'Emulator not found'], 404);
        }

        // Detach platforms first to maintain integrity
        $emu->platforms()->detach();

        if ($emu->image) {
            Storage::delete($emu->image);
        }

        $emu->delete();

        return response()->json(['result' => 'Emulator has been deleted'], 200);
    }

    function getEmu($id)
    {
        $emu = Emulator::with('platforms')->find($id);

        if (!$emu) {
            return response()->json(['error' => 'Emulator not found'], 404);
        }

        return response()->json($emu, 200);
    }

    public function updateEmu(Request $request, $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'platform_ids' => 'required|array',
                'platform_ids.*' => 'exists:platforms,id', // Validate platform IDs exist
                'description' => 'required|string',
                'link' => 'required|url',
                'img' => 'nullable|image|max:2048' // Image is optional
            ]);

            // Find the emulator by ID
            $emu = Emulator::find($id);

            // If emulator not found, return 404 error
            if (!$emu) {
                return response()->json(['error' => 'Emulator not found'], 404);
            }

            // Update emulator data
            $emu->name = $validatedData['name'];
            $emu->description = $validatedData['description'];
            $emu->link = $validatedData['link'];

            // Check if an image file is provided and store it
            if ($request->hasFile('img')) {
                // Delete the old image if it exists
                if ($emu->image) {
                    Storage::delete($emu->image);
                }

                $emu->image = $request->file('img')->store('emuimg');
            }

            $emu->save();

            // Sync the platforms to the emulator
            $emu->platforms()->sync($validatedData['platform_ids']);

            // Return the updated emulator
            return response()->json($emu->load('platforms'), 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors
            return response()->json(['error' => 'Validation Error', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            // If any other error occurs, return 500 error
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function searchEmu(Request $request)
    {
        $key = $request->input('key');
        $platformId = $request->input('platform_id');
    
        $query = Emulator::with('platforms');
    
        if ($key) {
            $query->where('name', 'like', "%{$key}%");
        }
    
        if ($platformId) {
            $query->whereHas('platforms', function ($q) use ($platformId) {
                $q->where('platform_id', $platformId);
            });
        }
    
        $emulators = $query->get();
        return response()->json($emulators);
    }
    
    
}
