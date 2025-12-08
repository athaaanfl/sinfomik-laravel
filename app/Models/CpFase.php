<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CpFase extends Model
{
    protected $fillable = [
        'mata_pelajaran_id',
        'fase',
        'deskripsi',
    ];

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function elemenPembelajarans(): HasMany
    {
        return $this->hasMany(ElemenPembelajaran::class);
    }
}
