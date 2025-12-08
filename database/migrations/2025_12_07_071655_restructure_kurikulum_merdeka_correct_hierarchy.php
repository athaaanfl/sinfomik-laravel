<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Struktur yang benar:
     * 1. Mata Pelajaran
     * 2. CP Fase (A/B/C) - langsung di bawah Mata Pelajaran
     * 3. Elemen (Bilangan, Geometri, dll) - di bawah CP Fase
     * 4. CP Elemen - di bawah Elemen
     * 5. TP - di bawah CP Elemen
     * 6. TP Pemetaan - mapping TP ke kelas & semester
     */
    public function up(): void
    {
        // Drop nilais dulu karena ada foreign key
        Schema::dropIfExists('nilais');
        
        // Drop semua tabel lama
        Schema::dropIfExists('tp_pemetaans');
        Schema::dropIfExists('tujuan_pembelajarans');
        Schema::dropIfExists('capaian_pembelajarans');
        Schema::dropIfExists('elemen_pembelajarans');
        
        // 1. CP Fase - langsung di bawah Mata Pelajaran
        Schema::create('cp_fases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajarans')->cascadeOnDelete();
            $table->enum('fase', ['A', 'B', 'C']);
            $table->text('deskripsi'); // CP Mata Pelajaran untuk fase ini
            $table->timestamps();
            
            $table->unique(['mata_pelajaran_id', 'fase']);
        });
        
        // 2. Elemen - di bawah CP Fase
        Schema::create('elemen_pembelajarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cp_fase_id')->constrained('cp_fases')->cascadeOnDelete();
            $table->string('nama'); // Bilangan, Geometri, dll
            $table->smallInteger('urutan')->default(0);
            $table->timestamps();
            
            $table->unique(['cp_fase_id', 'nama']);
        });
        
        // 3. CP Elemen - di bawah Elemen
        Schema::create('cp_elemens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('elemen_pembelajaran_id')->constrained('elemen_pembelajarans')->cascadeOnDelete();
            $table->text('deskripsi'); // CP untuk elemen ini
            $table->timestamps();
        });
        
        // 4. TP - di bawah CP Elemen
        Schema::create('tujuan_pembelajarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cp_elemen_id')->constrained('cp_elemens')->cascadeOnDelete();
            $table->string('kode')->nullable();
            $table->text('deskripsi');
            $table->smallInteger('urutan')->default(0);
            $table->timestamps();
        });
        
        // 5. TP Pemetaan - mapping ke kelas & semester (tetap sama)
        Schema::create('tp_pemetaans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tujuan_pembelajaran_id')->constrained('tujuan_pembelajarans')->cascadeOnDelete();
            $table->smallInteger('tingkat'); // 1-6 untuk kelas
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['tujuan_pembelajaran_id', 'tingkat', 'semester_id'], 'unique_tp_pemetaan');
        });
        
        // Recreate nilais table
        Schema::create('nilais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->cascadeOnDelete();
            $table->foreignId('tujuan_pembelajaran_id')->constrained('tujuan_pembelajarans')->cascadeOnDelete();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignId('guru_id')->constrained('gurus')->cascadeOnDelete();
            $table->decimal('nilai', 5, 2);
            $table->text('catatan')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();
            
            $table->unique(['siswa_id', 'tujuan_pembelajaran_id', 'semester_id'], 'unique_nilai_tp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tp_pemetaans');
        Schema::dropIfExists('tujuan_pembelajarans');
        Schema::dropIfExists('cp_elemens');
        Schema::dropIfExists('elemen_pembelajarans');
        Schema::dropIfExists('cp_fases');
    }
};
