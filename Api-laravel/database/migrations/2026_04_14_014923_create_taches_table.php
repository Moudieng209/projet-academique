<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->enum('statut', ['en_attente', 'en_cours', 'termine'])->default('en_attente');
            $table->foreignId('projet_id')->constrained('projets')->onDelete('cascade');
            $table->foreignId('utilisateur_id')->constrained('users')->onDelete('cascade'); // L'étudiant affecté
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taches');
    }
};
