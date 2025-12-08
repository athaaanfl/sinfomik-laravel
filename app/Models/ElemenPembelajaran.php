<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ElemenPembelajaran extends Model
{
    use HasFactory;
    
    protected $table = 'elemen_pembelajarans';
    protected $fillable = [
        'cp_fase_id',
        'nama',
        'urutan',
    ];
    public $timestamps = true;

    /**
     * Elemen Pembelajaran milik satu CP Fase.
     */
    public function cpFase(): BelongsTo
    {
        return $this->belongsTo(CpFase::class);
    }

    /**
     * Elemen Pembelajaran memiliki satu CP Elemen.
     */
    public function cpElemen(): HasOne
    {
        return $this->hasOne(CpElemen::class);
    }
}
