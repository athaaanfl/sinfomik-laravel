<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelasMaster extends Model
{
    protected $table = 'kelas_master';
    
    protected $fillable = [
        'nama',
        'tingkat',
    ];
}
