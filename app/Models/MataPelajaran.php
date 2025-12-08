<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MataPelajaran extends Model
{
    use HasFactory;
    
    protected $table = 'mata_pelajarans';
    protected $fillable = [
        'name',
        'slug',
    ];
    public $timestamps = true;

    /**
     * Append accessor ke serialization
     */
    protected $appends = ['nama'];

    /**
     * Accessor untuk backward compatibility
     * Frontend masih menggunakan 'nama' dalam beberapa tempat
     */
    public function getNamaAttribute(): string
    {
        return $this->name;
    }

    /**
     * Mata Pelajaran memiliki banyak CP Fase.
     */
    public function cpFases(): HasMany
    {
        return $this->hasMany(CpFase::class);
    }
}