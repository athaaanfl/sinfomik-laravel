<?php

namespace App\Listeners;

use App\Events\WaliKelasAssigned;
use App\Models\MapelWaliKelas;
use App\Models\PenugasanMengajar;
use App\Enums\TipePenugasan;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoCreatePenugasanWaliKelas
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WaliKelasAssigned $event): void
    {
        try {
            DB::beginTransaction();

            $kelas = $event->kelas;
            $guruId = $event->guruId;
            $tahunAjaranId = $event->tahunAjaranId;

            // Hapus penugasan wali kelas yang lama untuk kelas ini (jika ada pergantian)
            PenugasanMengajar::where('kelas_id', $kelas->id)
                ->where('tahun_ajaran_id', $tahunAjaranId)
                ->where('tipe_penugasan', TipePenugasan::WALI_KELAS)
                ->delete();

            // Get konfigurasi mata pelajaran untuk wali kelas yang sesuai dengan tingkat kelas
            $mapelConfigs = MapelWaliKelas::getMapelForTingkat($kelas->tingkat);

            // Create penugasan untuk setiap mata pelajaran
            foreach ($mapelConfigs as $config) {
                PenugasanMengajar::create([
                    'guru_id' => $guruId,
                    'mata_pelajaran_id' => $config->mata_pelajaran_id,
                    'kelas_id' => $kelas->id,
                    'tahun_ajaran_id' => $tahunAjaranId,
                    'tipe_penugasan' => TipePenugasan::WALI_KELAS,
                    'keterangan' => 'Auto-generated dari penugasan wali kelas',
                ]);
            }

            DB::commit();

            Log::info('Auto-create penugasan wali kelas', [
                'kelas_id' => $kelas->id,
                'guru_id' => $guruId,
                'jumlah_mapel' => $mapelConfigs->count(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal auto-create penugasan wali kelas', [
                'kelas_id' => $event->kelas->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
