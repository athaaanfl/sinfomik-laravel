<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuruKelasController extends Controller
{
    public function index(Request $request): Response
    {
        $guru = $request->user()->guru;

        // Ambil semua kelas yang diampu guru
        $kelasList = $guru->penugasanMengajars()
            ->with([
                'kelas.siswas',
                'kelas.tahunAjaran',
                'mataPelajaran',
            ])
            ->get()
            ->groupBy('kelas_id')
            ->map(function ($penugasans) {
                $kelas = $penugasans->first()->kelas;
                return [
                    'id' => $kelas->id,
                    'nama' => $kelas->nama_lengkap,
                    'tingkat' => $kelas->tingkat,
                    'tahun_ajaran' => $kelas->tahunAjaran->nama,
                    'jumlah_siswa' => $kelas->siswas->count(),
                    'mata_pelajarans' => $penugasans->map(fn($p) => [
                        'id' => $p->mataPelajaran->id,
                        'nama' => $p->mataPelajaran->name,
                    ]),
                ];
            })
            ->values();

        return Inertia::render('guru/kelas/index', [
            'kelasList' => $kelasList,
        ]);
    }

    public function show(Request $request, Kelas $kelas): Response
    {
        $guru = $request->user()->guru;

        // Authorization: Cek apakah guru mengajar di kelas ini
        $hasAccess = $guru->penugasanMengajars()
            ->where('kelas_id', $kelas->id)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        // Load data kelas dengan siswa
        $kelas->load([
            'tahunAjaran',
            'siswas' => function ($query) {
                $query->orderBy('nama_lengkap');
            }
        ]);

        // Ambil mata pelajaran yang diampu guru di kelas ini
        $mataPelajarans = $guru->penugasanMengajars()
            ->where('kelas_id', $kelas->id)
            ->with('mataPelajaran')
            ->get()
            ->map(fn($p) => [
                'id' => $p->mataPelajaran->id,
                'nama' => $p->mataPelajaran->name,
                'penugasan_id' => $p->id,
            ]);

        return Inertia::render('guru/kelas/show', [
            'kelas' => [
                'id' => $kelas->id,
                'nama' => $kelas->nama_lengkap,
                'tingkat' => $kelas->tingkat,
                'tahun_ajaran' => $kelas->tahunAjaran->nama,
            ],
            'siswas' => $kelas->siswas->map(fn($siswa) => [
                'id' => $siswa->id,
                'nis' => $siswa->nis,
                'nisn' => $siswa->nisn,
                'nama_lengkap' => $siswa->nama_lengkap,
                'nama_panggilan' => $siswa->nama_panggilan,
                'gender' => $siswa->gender,
                'status' => $siswa->status,
            ]),
            'mataPelajarans' => $mataPelajarans,
        ]);
    }

    public function siswa(Request $request, Kelas $kelas): Response
    {
        $guru = $request->user()->guru;

        // Authorization
        $hasAccess = $guru->penugasanMengajars()
            ->where('kelas_id', $kelas->id)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        $kelas->load(['siswas' => function ($query) {
            $query->orderBy('nama_lengkap');
        }]);

        return Inertia::render('guru/kelas/siswa', [
            'kelas' => [
                'id' => $kelas->id,
                'nama' => $kelas->nama_lengkap,
                'tingkat' => $kelas->tingkat,
            ],
            'siswas' => $kelas->siswas,
        ]);
    }
}
