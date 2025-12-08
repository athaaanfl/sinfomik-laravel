<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    use HasFactory;
    
    protected $table = 'semesters';
    protected $fillable = [
        'tahun_ajaran_id',
        'tipe',
    ];
    public $timestamps = true;
    
    /**
     * Semester milik satu Tahun Ajaran.
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
    
    /**
     * Semester memiliki banyak Nilai.
     */
    public function nilais(): HasMany
    {
        return $this->hasMany(Nilai::class, 'semester_id');
    }
}