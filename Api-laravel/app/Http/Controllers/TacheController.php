<?php

namespace App\Http\Controllers;

use App\Models\Projet;
use App\Models\Tache;
use Illuminate\Http\Request;

class TacheController extends Controller
{
    /**
     * Get tasks for a specific projet
     *
     * @authenticated
     */
    public function index(Projet $projet)
    {
        return response()->json($projet->taches()->with('assigneA')->get());
    }

    /**
     * Add a task to a projet
     *
     * @authenticated
     */
    public function store(Request $request, Projet $projet)
    {
        $validated = $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'utilisateur_id' => 'required|exists:users,id' // On vérifie que l'étudiant assigné existe
        ]);

        $tache = $projet->taches()->create([
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'utilisateur_id' => $validated['utilisateur_id'],
            'createur_id' => auth()->id(),
            'statut' => 'en_attente' // Statut par défaut
        ]);

        return response()->json($tache, 201);
    }

    /**
     * Update task status
     *
     * @authenticated
     */
    public function updateStatut(Request $request, Tache $tache)
    {
        $userId = auth()->id();

        if ($userId !== $tache->utilisateur_id && $userId !== $tache->createur_id) {
            return response()->json(['message' => 'Accès refusé : vous ne pouvez pas modifier le statut de cette tâche'], 403);
        }

        $validated = $request->validate([
            'statut' => 'required|in:en_attente,en_cours,termine'
        ]);

        $tache->update(['statut' => $validated['statut']]);

        return response()->json($tache);
    }

    /**
     * Delete a task
     *
     * @authenticated
     */
    public function destroy(Tache $tache)
    {
        $tache->delete();
        return response()->json(['message' => 'Tâche supprimée avec succès']);
    }
}
