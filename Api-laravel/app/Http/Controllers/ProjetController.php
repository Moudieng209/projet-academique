<?php

namespace App\Http\Controllers;

use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjetController extends Controller
{
    /**
     * Get all projets
     *
     * @authenticated
     */
    public function index()
    {
        return response()->json(Projet::with('createur')->get());
    }

    /**
     * Create a new projet
     *
     * @authenticated
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut'
        ]);

        $projet = Auth::user()->projets()->create($validated);
        return response()->json($projet, 201);
    }

    /**
     * Get a projet with its tasks
     *
     * @authenticated
     */
    public function show(Projet $projet)
    {
        return response()->json($projet->load('taches'));
    }

    /**
     * Update an existing projet
     *
     * @authenticated
     */
    public function update(Request $request, Projet $projet)
    {
        if ($projet->utilisateur_id !== Auth::id()) {
            return response()->json(['message' => 'Action non autorisée. Seul le créateur peut modifier ce projet.'], 403);
        }

        $validated = $request->validate([
            'titre' => 'sometimes|string',
            'description' => 'sometimes|string',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after_or_equal:date_debut'
        ]);

        $projet->update($validated);
        return response()->json($projet);
    }

    /**
     * Delete a projet
     *
     * @authenticated
     */
    public function destroy(Projet $projet)
    {
        if ($projet->utilisateur_id !== Auth::id()) {
            return response()->json(['message' => 'Action non autorisée. Seul le créateur peut supprimer ce projet.'], 403);
        }

        $projet->delete();
        return response()->json(['message' => 'Projet supprimé avec succès']);
    }
}
