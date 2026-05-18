<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    use HasFactory;

    protected $fillable = ['titre', 'description', 'date_debut', 'date_fin', 'utilisateur_id'];
    protected $with = ['taches'];

    public function createur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function taches()
    {
        return $this->hasMany(Tache::class, 'projet_id');
    }
}
