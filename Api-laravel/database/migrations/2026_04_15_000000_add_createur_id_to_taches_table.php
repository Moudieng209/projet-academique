<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('taches', function (Blueprint $table) {
            $table->foreignId('createur_id')->nullable()->after('utilisateur_id')->constrained('users')->nullOnDelete();
        });

        DB::table('taches')->whereNull('createur_id')->update(['createur_id' => DB::raw('utilisateur_id')]);
    }

    public function down(): void
    {
        Schema::table('taches', function (Blueprint $table) {
            $table->dropConstrainedForeignId('createur_id');
        });
    }
};
