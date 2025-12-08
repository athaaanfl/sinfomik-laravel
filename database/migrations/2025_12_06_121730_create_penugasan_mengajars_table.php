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
        Schema::create('penugasan_mengajars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajarans')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajarans')->onDelete('cascade');
            $table->string('tipe_penugasan'); // bidang_studi atau wali_kelas
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Unique constraint: satu guru tidak bisa mengajar mata pelajaran yang sama di kelas yang sama pada tahun ajaran yang sama
            $table->unique(['guru_id', 'mata_pelajaran_id', 'kelas_id', 'tahun_ajaran_id'], 'unique_penugasan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penugasan_mengajars');
    }
};
