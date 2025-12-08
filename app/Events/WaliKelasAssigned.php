<?php

namespace App\Events;

use App\Models\Kelas;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WaliKelasAssigned
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Kelas $kelas;
    public int $guruId;
    public ?int $tahunAjaranId;

    /**
     * Create a new event instance.
     */
    public function __construct(Kelas $kelas, int $guruId, ?int $tahunAjaranId = null)
    {
        $this->kelas = $kelas;
        $this->guruId = $guruId;
        $this->tahunAjaranId = $tahunAjaranId ?? $kelas->tahun_ajaran_id;
    }
}
