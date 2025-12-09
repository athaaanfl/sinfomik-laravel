<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    use HasFactory;
    
    protected $table = 'siswas';
    protected $fillable = [
        'nama_lengkap',
        'nama_panggilan',
        'nis',
        'nisn',
        'tahun_masuk',
        'tahun_lulus',
        'tanggal_lulus',
        'status',
        'gender',
        'tanggal_lahir',
        'tempat_lahir',
        'agama',
        'alamat',
        'nomor_telepon',
        'nama_ayah',
        'nama_ibu',
        'nomor_telepon_wali',
    ];
    
    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_lulus' => 'date',
    ];
    
    public $timestamps = true;
    
    /**
     * Siswa memiliki banyak Nilai.
     */
    public function nilais(): HasMany
    {
        return $this->hasMany(Nilai::class, 'siswa_id');
    }

    /**
     * Siswa terdaftar di banyak Kelas (Historis) melalui tabel pivot kelas_siswa.
     */
    public function kelas(): BelongsToMany
    {
        return $this->belongsToMany(
            Kelas::class, 
            'kelas_siswa', // Nama tabel pivot
            'siswa_id',    // FK lokal
            'kelas_id'     // FK yang terhubung
        )
        // Menyertakan kolom-kolom tambahan dari tabel pivot
        ->withPivot(['start_date', 'end_date'])
        ->withTimestamps(); 
    }
}