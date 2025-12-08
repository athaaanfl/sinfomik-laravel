<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gurus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); 
            $table->string('nip')->unique()->nullable(); 
            $table->enum('gender', ['laki-laki', 'perempuan']);
            $table->date('tanggal_lahir')->nullable();
            $table->string('nomor_telepon', 15)->nullable();
            $table->text('alamat')->nullable();
            $table->string('kualifikasi')->nullable();
            $table->boolean('is_wali_kelas')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gurus');
    }
};
