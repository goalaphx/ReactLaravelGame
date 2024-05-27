<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    function addCategory(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'img' => 'required|image|max:2048' // Image is required
        ]);

        // Create a new category
        $cat = new Category;
        $cat->name = $validatedData['name'];
        $cat->logo = $request->file('img')->store('categoryimg');
        $cat->save();

        return response()->json($cat, 201);
    }

    function listCategory()
    {
        return Category::all();
    }

    function deleteCategory($id)
    {
        $cat = Category::find($id);

        if (!$cat) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        if ($cat->logo) {
            Storage::delete($cat->logo);
        }

        $cat->delete();

        return response()->json(['result' => 'Category has been deleted'], 200);
    }

    function getCategory($id)
    {
        $cat = Category::find($id);

        if (!$cat) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        return response()->json($cat, 200);
    }

    public function updateCategory(Request $request, $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'img' => 'nullable|image|max:2048' // Image is optional
            ]);

            // Find the category by ID
            $cat = Category::find($id);

            // If category not found, return 404 error
            if (!$cat) {
                return response()->json(['error' => 'Category not found'], 404);
            }

            // Update category data
            $cat->name = $validatedData['name'];

            // Check if an image file is provided and store it
            if ($request->hasFile('img')) {
                // Delete the old image if it exists
                if ($cat->logo) {
                    Storage::delete($cat->logo);
                }

                $cat->logo = $request->file('img')->store('categoryimg');
            }

            $cat->save();

            // Return the updated category
            return response()->json($cat, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors
            return response()->json(['error' => 'Validation Error', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            // If any other error occurs, return 500 error
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    function searchCategory($key)
    {
        return Category::where('name', 'like', "%$key%")->get();
    }
}

