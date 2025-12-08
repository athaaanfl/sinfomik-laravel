<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guru extends Model
{
    use HasFactory;
    
    protected $table = 'gurus';
    protected $fillable = [
        'user_id',
        'nip',
        'gender',
        'tanggal_lahir',
        'nomor_telepon',
        'alamat',
        'kualifikasi',
        'is_wali_kelas',
    ];
    public $timestamps = true;

    /**
     * Guru memiliki satu akun User (untuk login).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Guru dapat menjadi Wali Kelas untuk banyak Kelas.
     */
    public function kelasWali(): HasMany
    {
        return $this->hasMany(Kelas::class, 'homeroom_teacher_id');
    }

    /**
     * Guru memiliki banyak penugasan mengajar
     */
    public function penugasanMengajars(): HasMany
    {
        return $this->hasMany(PenugasanMengajar::class);
    }

    /**
     * Get nama lengkap guru (dari user)
     */
    public function getNamaAttribute(): string
    {
        return $this->user->name ?? '';
    }
}