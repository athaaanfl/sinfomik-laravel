<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nilai extends Model
{
    use HasFactory;
    
    protected $table = 'nilais';
    protected $fillable = [
        'siswa_id',
        'tujuan_pembelajaran_id',
        'kelas_id',
        'semester_id',
        'guru_id',
        'nilai',
        'catatan',
        'recorded_at',
    ];
    public $timestamps = true;

    /**
     * Nilai milik satu Siswa.
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    /**
     * Nilai milik satu Tujuan Pembelajaran.
     */
    public function tujuanPembelajaran(): BelongsTo
    {
        return $this->belongsTo(TujuanPembelajaran::class, 'tujuan_pembelajaran_id');
    }

    /**
     * Nilai terkait dengan satu Kelas (historis).
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    /**
     * Nilai terkait dengan satu Semester.
     */
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    /**
     * Nilai dinilai oleh satu Guru.
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }
}