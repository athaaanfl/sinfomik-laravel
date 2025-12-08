<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajarans')->onDelete('restrict');
            $table->enum('tipe', ['Ganjil', 'Genap']); 
            $table->timestamps();
            
            $table->unique(['tahun_ajaran_id', 'tipe']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semesters');
    }
};