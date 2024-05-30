<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\EmuController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\NotificationController;

Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::post('addgame', [GameController::class, 'addGame']);
Route::get('list', [GameController::class, 'list']);
Route::delete('delete/{id}', [GameController::class, 'delete']);
Route::get('game/{id}', [GameController::class, 'getGame']);
Route::post('update/{id}', [GameController::class, 'updateGame']); // Updated route for updating game
Route::get('search/{key}', [GameController::class, 'search']);
Route::post('addemu', [EmuController::class, 'addEmulator']);
Route::get('listemu', [EmuController::class, 'listEmu']);
Route::delete('deleteemu/{id}', [EmuController::class, 'deleteEmu']);
Route::get('emu/{id}', [EmuController::class, 'getEmu']);
Route::post('updateemu/{id}', [EmuController::class, 'updateEmu']); // Updated route for updating emulator
Route::get('searchemu/{key}', [EmuController::class, 'searchEmu']);
Route::post('addplat', [PlatformController::class, 'addPlatform']);
Route::get('listplat', [PlatformController::class, 'listPlatform']);
Route::delete('deleteplat/{id}', [PlatformController::class, 'deletePlatform']);
Route::get('plat/{id}', [PlatformController::class, 'getPlatform']);
Route::post('updateplat/{id}', [PlatformController::class, 'updatePlatform']); // Updated route for updating platform
Route::get('searchplat/{key}', [PlatformController::class, 'searchPlatform']);
Route::post('addcat', [CategoryController::class, 'addCategory']);
Route::get('listcat', [CategoryController::class, 'listCategory']);
Route::delete('deletecat/{id}', [CategoryController::class, 'deleteCategory']);
Route::get('cat/{id}', [CategoryController::class, 'getCategory']);
Route::post('updatecat/{id}', [CategoryController::class, 'updateCategory']); // Updated route for updating category
Route::get('searchcat/{key}', [CategoryController::class, 'searchCategory']);
Route::post('events/add', [EventController::class, 'addEvent']);
Route::get('events/list', [EventController::class, 'list']);
Route::get('events/{id}', [EventController::class, 'getEvent']);
Route::post('events/update/{id}', [EventController::class, 'updateEvent']);
Route::delete('events/delete/{id}', [EventController::class, 'delete']);
Route::get('events/search/{key}', [EventController::class, 'search']);
Route::post('/news/add', [NewsController::class, 'addNews']);
Route::get('/news/list', [NewsController::class, 'listNews']);
Route::get('/news/list', [NewsController::class, 'list']);
Route::get('/news/{id}', [NewsController::class, 'getNews']);
Route::post('/news/add', [NewsController::class, 'addNews']);
Route::post('/news/update/{id}', [NewsController::class, 'updateNews']);
Route::delete('/news/delete/{id}', [NewsController::class, 'deleteNews']);
Route::post('/favorites', [FavoriteController::class, 'addFavorite']);
Route::delete('/favorites/{id}', [FavoriteController::class, 'removeFavorite']);
Route::get('/favorites', [FavoriteController::class, 'getFavorites']);
Route::get('/notifications/{userId}', [NotificationController::class, 'index']);
Route::post('notifications/mark-as-read/{id}', [NotificationController::class, 'markAsRead']);
Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);

