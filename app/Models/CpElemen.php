<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CpElemen extends Model
{
    protected $fillable = [
        'elemen_pembelajaran_id',
        'deskripsi',
    ];

    public function elemenPembelajaran(): BelongsTo
    {
        return $this->belongsTo(ElemenPembelajaran::class);
    }

    public function tujuanPembelajarans(): HasMany
    {
        return $this->hasMany(TujuanPembelajaran::class);
    }
}
