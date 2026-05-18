<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\TacheController;

// Routes d'authentification publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD Projets complet
    Route::apiResource('projets', ProjetController::class);

    // Gestion des Tâches liées aux Projets
    Route::get('/projets/{projet}/taches', [TacheController::class, 'index']); // Lister les tâches d'un projet
    Route::post('/projets/{projet}/taches', [TacheController::class, 'store']); // Ajouter une tâche à un projet

    // Gestion des Tâches individuelles
    Route::put('/taches/{tache}/statut', [TacheController::class, 'updateStatut']); // Modifier le statut
    Route::delete('/taches/{tache}', [TacheController::class, 'destroy']); // Supprimer la tâche
});
