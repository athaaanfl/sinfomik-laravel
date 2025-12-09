<?php

namespace App\Http\Controllers\Guru;

use App\Enums\TipePenugasan;
use App\Http\Controllers\Controller;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuruDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $guru = $request->user()->guru;
        
        if (!$guru) {
            abort(403, 'Anda tidak memiliki profil guru.');
        }

        // Ambil tahun ajaran aktif
        $tahunAjaranAktif = TahunAjaran::where('is_active', true)->first();
        
        if (!$tahunAjaranAktif) {
            return Inertia::render('guru/dashboard', [
                'error' => 'Tidak ada tahun ajaran aktif.',
                'isWaliKelas' => false,
            ]);
        }

        // Ambil penugasan guru untuk tahun ajaran aktif
        $penugasans = $guru->penugasanMengajars()
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->with(['mataPelajaran', 'kelas.siswas', 'kelas.tahunAjaran'])
            ->get();

        if ($penugasans->isEmpty()) {
            return Inertia::render('guru/dashboard', [
                'error' => 'Anda belum memiliki penugasan mengajar untuk tahun ajaran ini.',
                'isWaliKelas' => false,
                'tahunAjaran' => [
                    'id' => $tahunAjaranAktif->id,
                    'nama' => $tahunAjaranAktif->kode_tahun_ajaran,
                ],
            ]);
        }

        // Cek apakah guru adalah wali kelas
        $penugasanWaliKelas = $penugasans->first(function ($p) {
            return $p->tipe_penugasan === TipePenugasan::WALI_KELAS;
        });

        $isWaliKelas = $penugasanWaliKelas !== null;

        // Data untuk wali kelas
        $dataWaliKelas = null;
        if ($isWaliKelas) {
            $kelas = $penugasanWaliKelas->kelas;
            $mataPelajaranDiampu = $penugasans->map(function ($p) {
                return [
                    'id' => $p->mata_pelajaran_id,
                    'nama' => $p->mataPelajaran->name,
                    'kelas_id' => $p->kelas_id,
                    'penugasan_id' => $p->id,
                ];
            })->unique('id')->values();

            $dataWaliKelas = [
                'kelas' => [
                    'id' => $kelas->id,
                    'nama' => $kelas->nama_lengkap,
                    'tingkat' => $kelas->tingkat,
                    'tahun_ajaran' => $kelas->tahunAjaran->nama,
                    'jumlah_siswa' => $kelas->siswas->count(),
                ],
                'mata_pelajaran' => $mataPelajaranDiampu,
            ];
        }

        // Data untuk guru bidang studi
        $dataBidangStudi = null;
        if (!$isWaliKelas) {
            // Group by mata pelajaran
            $grouped = $penugasans->groupBy('mata_pelajaran_id')->map(function ($group) {
                $mataPelajaran = $group->first()->mataPelajaran;
                return [
                    'id' => $mataPelajaran->id,
                    'nama' => $mataPelajaran->name,
                    'kelas' => $group->map(function ($p) {
                        return [
                            'id' => $p->kelas->id,
                            'nama' => $p->kelas->nama_lengkap,
                            'tingkat' => $p->kelas->tingkat,
                            'jumlah_siswa' => $p->kelas->siswas->count(),
                            'penugasan_id' => $p->id,
                        ];
                    })->values(),
                ];
            })->values();

            $dataBidangStudi = [
                'mata_pelajaran' => $grouped,
            ];
        }

        return Inertia::render('guru/dashboard', [
            'isWaliKelas' => $isWaliKelas,
            'dataWaliKelas' => $dataWaliKelas,
            'dataBidangStudi' => $dataBidangStudi,
            'tahunAjaran' => [
                'id' => $tahunAjaranAktif->id,
                'nama' => $tahunAjaranAktif->kode_tahun_ajaran,
            ],
        ]);
    }
}
