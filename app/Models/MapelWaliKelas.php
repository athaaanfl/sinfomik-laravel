<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MapelWaliKelas extends Model
{
    use HasFactory;

    protected $table = 'mapel_wali_kelas';

    protected $fillable = [
        'mata_pelajaran_id',
        'tingkat_allowed',
        'is_active',
        'urutan',
    ];

    protected $casts = [
        'tingkat_allowed' => 'array',
        'is_active' => 'boolean',
    ];

    protected $with = ['mataPelajaran'];

    /**
     * Relasi ke Mata Pelajaran
     */
    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    /**
     * Scope: Hanya yang aktif
     */
    public function scopeAktif($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Urutkan berdasarkan urutan
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan');
    }

    /**
     * Check apakah mata pelajaran ini diperbolehkan untuk tingkat tertentu
     */
    public function isAllowedForTingkat(int $tingkat): bool
    {
        return in_array($tingkat, $this->tingkat_allowed ?? []);
    }

    /**
     * Get mata pelajaran yang diperbolehkan untuk tingkat tertentu
     */
    public static function getMapelForTingkat(int $tingkat)
    {
        return self::aktif()
            ->ordered()
            ->get()
            ->filter(function ($mapel) use ($tingkat) {
                return $mapel->isAllowedForTingkat($tingkat);
            });
    }
}
