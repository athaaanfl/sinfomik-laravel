<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            
            $table->string('nama_lengkap');
            $table->string('nama_panggilan')->nullable();            
            $table->string('nis')->nullable()->unique(); 
            $table->string('nisn', 15)->nullable()->unique(); 
            $table->year('tahun_masuk');
            $table->enum('status', ['Aktif', 'Non Aktif'])->default('Aktif');
            
            $table->enum('gender', ['laki-laki', 'perempuan']);
            $table->date('tanggal_lahir')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->string('agama')->nullable(); 

            $table->string('alamat')->nullable();
            $table->string('nomor_telepon', 15)->nullable();
            
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('nomor_telepon_wali', 15)->nullable(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};
