<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TahunAjaran extends Model
{
    use HasFactory;
    
    protected $table = 'tahun_ajarans';
    protected $fillable = [
        'kode_tahun_ajaran',
        'tahunawal',
        'tahunakhir',
        'is_active',
    ];
    public $timestamps = true;

    /**
     * Tahun Ajaran memiliki banyak Semester.
     */
    public function semesters(): HasMany
    {
        return $this->hasMany(Semester::class, 'tahun_ajaran_id');
    }

    /**
     * Tahun Ajaran memiliki banyak Kelas.
     */
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class, 'tahun_ajaran_id');
    }
}