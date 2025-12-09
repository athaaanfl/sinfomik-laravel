<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Events\WaliKelasAssigned;

class Kelas extends Model
{
    use HasFactory;
    
    protected $table = 'kelas';
    protected $fillable = [
        'tahun_ajaran_id',
        'nama',
        'tingkat',
        'homeroom_teacher_id',
    ];
    
    public $timestamps = true;

    /**
     * Kelas dimiliki oleh satu Tahun Ajaran.
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
    
    /**
     * Accessor untuk mendapatkan nama lengkap kelas (contoh: "1 - Darehdeh", "2 - Beutong")
     */
    public function getNamaLengkapAttribute(): string
    {
        return $this->tingkat . ' - ' . $this->nama;
    }
    
    /**
     * Accessor untuk mendapatkan nama kelas (already exists as column)
     * This accessor is kept for backward compatibility
     */
    public function getNamaAttribute($value): string
    {
        return $value;
    }
    
    /**
     * Accessor untuk mendapatkan tingkat (already exists as column)
     * This accessor is kept for backward compatibility
     */
    public function getTingkatAttribute($value): int
    {
        return (int) $value;
    }

    /**
     * Kelas memiliki satu Wali Kelas (Homeroom Teacher).
     */
    public function waliKelas(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'homeroom_teacher_id');
    }

    /**
     * Alias for waliKelas.
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'homeroom_teacher_id');
    }

    /**
     * Kelas memiliki banyak Siswa (Historis) melalui tabel pivot kelas_siswa.
     */
    public function siswas(): BelongsToMany
    {
        return $this->belongsToMany(Siswa::class, 'kelas_siswa')
            ->withPivot(['start_date', 'end_date'])
            ->withTimestamps();
    }

    /**
     * Kelas memiliki banyak penugasan mengajar
     */
    public function penugasanMengajars(): HasMany
    {
        return $this->hasMany(PenugasanMengajar::class);
    }

    /**
     * Relasi ke homeroom teacher
     */
    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'homeroom_teacher_id');
    }

    /**
     * Assign wali kelas dan trigger event untuk auto-create penugasan mata pelajaran
     */
    public function assignWaliKelas(?int $guruId, ?int $tahunAjaranId = null): void
    {
        $oldGuruId = $this->homeroom_teacher_id;
        $this->homeroom_teacher_id = $guruId;
        $this->save();

        // Jika ada guru yang ditugaskan (bukan unassign), trigger event
        if ($guruId && $guruId !== $oldGuruId) {
            event(new WaliKelasAssigned($this, $guruId, $tahunAjaranId));
        }
    }
}