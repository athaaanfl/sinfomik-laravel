<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Change status enum to include more options
            DB::statement("ALTER TABLE siswas MODIFY COLUMN status ENUM('Aktif', 'Lulus', 'Keluar', 'Cuti') NOT NULL DEFAULT 'Aktif'");
            
            // Add graduation year field
            $table->year('tahun_lulus')->nullable()->after('tahun_masuk');
            
            // Add graduation date for more detailed tracking (optional)
            $table->date('tanggal_lulus')->nullable()->after('tahun_lulus');
        });
    }

    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Revert status enum back to original
            DB::statement("ALTER TABLE siswas MODIFY COLUMN status ENUM('Aktif', 'Non Aktif') NOT NULL DEFAULT 'Aktif'");
            
            // Drop graduation fields
            $table->dropColumn(['tahun_lulus', 'tanggal_lulus']);
        });
    }
};
