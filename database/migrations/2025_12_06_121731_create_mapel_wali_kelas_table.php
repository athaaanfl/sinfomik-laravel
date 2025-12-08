<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mapel_wali_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajarans')->onDelete('cascade');
            $table->json('tingkat_allowed'); // Array tingkat yang diperbolehkan, misal: [1,2,3] atau [3,4,5,6]
            $table->boolean('is_active')->default(true);
            $table->integer('urutan')->default(0); // Untuk sorting
            $table->timestamps();

            // Satu mata pelajaran hanya bisa ada satu konfigurasi
            $table->unique('mata_pelajaran_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mapel_wali_kelas');
    }
};
