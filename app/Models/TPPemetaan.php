<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TPPemetaan extends Model
{
    use HasFactory;
    
    protected $table = 'tp_pemetaans';
    protected $fillable = [
        'tujuan_pembelajaran_id',
        'tingkat',
        'semester_id',
    ];
    public $timestamps = true;

    /**
     * TP Pemetaan milik satu Tujuan Pembelajaran.
     */
    public function tujuanPembelajaran(): BelongsTo
    {
        return $this->belongsTo(TujuanPembelajaran::class, 'tujuan_pembelajaran_id');
    }

    /**
     * TP Pemetaan milik satu Semester.
     */
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
