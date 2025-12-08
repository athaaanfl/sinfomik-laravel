<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CapaianPembelajaran extends Model
{
    use HasFactory;
    
    protected $table = 'capaian_pembelajarans';
    protected $fillable = [
        'elemen_pembelajaran_id',
        'fase',
        'cp_fase',
        'cp_elemen',
    ];
    public $timestamps = true;

    /**
     * Capaian Pembelajaran milik satu Elemen Pembelajaran.
     */
    public function elemenPembelajaran(): BelongsTo
    {
        return $this->belongsTo(ElemenPembelajaran::class, 'elemen_pembelajaran_id');
    }

    /**
     * Capaian Pembelajaran memiliki banyak Tujuan Pembelajaran.
     */
    public function tujuanPembelajarans(): HasMany
    {
        return $this->hasMany(TujuanPembelajaran::class, 'capaian_pembelajaran_id');
    }
}
