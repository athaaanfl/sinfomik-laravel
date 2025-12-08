<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TujuanPembelajaran extends Model
{
    use HasFactory;
    
    protected $table = 'tujuan_pembelajarans';
    protected $fillable = [
        'cp_elemen_id',
        'kode',
        'deskripsi',
        'urutan',
    ];
    public $timestamps = true;

    /**
     * Tujuan Pembelajaran milik satu CP Elemen.
     */
    public function cpElemen(): BelongsTo
    {
        return $this->belongsTo(CpElemen::class);
    }

    /**
     * Tujuan Pembelajaran memiliki banyak Pemetaan (ke tingkat & semester).
     */
    public function tpPemetaans(): HasMany
    {
        return $this->hasMany(TPPemetaan::class, 'tujuan_pembelajaran_id');
    }

    /**
     * Tujuan Pembelajaran memiliki banyak Nilai.
     */
    public function nilais(): HasMany
    {
        return $this->hasMany(Nilai::class, 'tujuan_pembelajaran_id');
    }
}
