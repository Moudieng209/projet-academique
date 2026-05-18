<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tache extends Model
{
    use HasFactory;

    protected $fillable = ['titre', 'description', 'statut', 'projet_id', 'utilisateur_id', 'createur_id'];

    public function projet()
    {
        return $this->belongsTo(Projet::class, 'projet_id');
    }

    public function assigneA()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
