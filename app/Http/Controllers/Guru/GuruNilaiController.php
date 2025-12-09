<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
use App\Models\PenugasanMengajar;
use App\Models\Semester;
use App\Models\TPPemetaan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuruNilaiController extends Controller
{
    public function list(Request $request): Response
    {
        $guru = $request->user()->guru;

        // Ambil semua penugasan mengajar guru
        $penugasanList = $guru->penugasanMengajars()
            ->with([
                'kelas.siswas',
                'kelas.tahunAjaran',
                'mataPelajaran',
            ])
            ->get()
            ->map(function ($penugasan) {
                return [
                    'id' => $penugasan->id,
                    'kelas' => [
                        'id' => $penugasan->kelas->id,
                        'nama' => $penugasan->kelas->nama_lengkap,
                        'tingkat' => $penugasan->kelas->tingkat,
                    ],
                    'mata_pelajaran' => [
                        'id' => $penugasan->mataPelajaran->id,
                        'nama' => $penugasan->mataPelajaran->name,
                    ],
                    'tahun_ajaran' => [
                        'nama' => $penugasan->kelas->tahunAjaran->nama,
                    ],
                    'jumlah_siswa' => $penugasan->kelas->siswas->count(),
                ];
            });

        return Inertia::render('guru/nilai/list', [
            'penugasanList' => $penugasanList,
        ]);
    }

    public function index(Request $request, PenugasanMengajar $penugasan): Response
    {
        $guru = $request->user()->guru;

        // Authorization: Pastikan penugasan milik guru yang login
        if ($penugasan->guru_id !== $guru->id) {
            abort(403, 'Anda tidak memiliki akses ke penugasan ini.');
        }

        // Load relasi yang dibutuhkan
        $penugasan->load([
            'kelas.siswas',
            'mataPelajaran',
            'kelas.tahunAjaran',
        ]);

        // Ambil semester aktif (dari tahun ajaran aktif)
        $tahunAjaranAktif = \App\Models\TahunAjaran::where('is_active', true)->first();
        
        if (!$tahunAjaranAktif) {
            return Inertia::render('guru/nilai/index', [
                'error' => 'Tidak ada tahun ajaran aktif.',
            ]);
        }

        // Ambil semester dari tahun ajaran aktif (default: Ganjil)
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->first();

        if (!$semesterAktif) {
            return Inertia::render('guru/nilai/index', [
                'error' => 'Tidak ada semester untuk tahun ajaran aktif.',
            ]);
        }

        $tingkat = $penugasan->kelas->tingkat;
        $mataPelajaranId = $penugasan->mata_pelajaran_id;

        // Query TP Pemetaan yang relevan
        $tpPemetaans = TPPemetaan::with([
            'tujuanPembelajaran.cpElemen.elemenPembelajaran',
            'semester',
        ])
        ->whereHas('tujuanPembelajaran.cpElemen.elemenPembelajaran.cpFase', function ($q) use ($mataPelajaranId) {
            $q->where('mata_pelajaran_id', $mataPelajaranId);
        })
        ->where('tingkat', $tingkat)
        ->where('semester_id', $semesterAktif->id)
        ->get();

        // Ambil siswa di kelas
        $siswas = $penugasan->kelas->siswas;

        // Ambil nilai yang sudah ada (by tujuan_pembelajaran_id)
        $siswaIds = $siswas->pluck('id');
        $tpIds = $tpPemetaans->pluck('tujuan_pembelajaran_id')->unique();

        $nilaiExisting = Nilai::whereIn('siswa_id', $siswaIds)
            ->whereIn('tujuan_pembelajaran_id', $tpIds)
            ->where('kelas_id', $penugasan->kelas_id)
            ->where('semester_id', $semesterAktif->id)
            ->get();

        // Transform data untuk frontend
        $tpPemetaansList = $tpPemetaans->map(function ($pemetaan) {
            $tp = $pemetaan->tujuanPembelajaran;
            return [
                'id' => $pemetaan->id,
                'tp_id' => $tp->id,
                'tp_kode' => $tp->kode,
                'tp_deskripsi' => $tp->deskripsi,
                'elemen_nama' => $tp->cpElemen->elemenPembelajaran->nama,
            ];
        });

        $siswasList = $siswas->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'nis' => $siswa->nis,
                'nama_lengkap' => $siswa->nama_lengkap,
                'nama_panggilan' => $siswa->nama_panggilan,
            ];
        });

        $nilaisList = $nilaiExisting->map(function ($nilai) {
            return [
                'id' => $nilai->id,
                'siswa_id' => $nilai->siswa_id,
                'tujuan_pembelajaran_id' => $nilai->tujuan_pembelajaran_id,
                'nilai' => $nilai->nilai,
                'catatan' => $nilai->catatan,
            ];
        });

        return Inertia::render('guru/nilai/index', [
            'penugasan' => [
                'id' => $penugasan->id,
                'kelas' => [
                    'id' => $penugasan->kelas->id,
                    'nama' => $penugasan->kelas->nama_lengkap,
                    'tingkat' => $penugasan->kelas->tingkat,
                ],
                'mata_pelajaran' => [
                    'id' => $penugasan->mataPelajaran->id,
                    'nama' => $penugasan->mataPelajaran->name,
                ],
                'tahun_ajaran' => [
                    'id' => $tahunAjaranAktif->id,
                    'nama' => $tahunAjaranAktif->nama,
                    'semester' => $semesterAktif->tipe,
                ],
            ],
            'siswas' => $siswasList,
            'tpPemetaans' => $tpPemetaansList,
            'nilais' => $nilaisList,
        ]);
    }

    public function store(Request $request, PenugasanMengajar $penugasan): RedirectResponse
    {
        $guru = $request->user()->guru;

        // Authorization
        if ($penugasan->guru_id !== $guru->id) {
            abort(403);
        }

        $validated = $request->validate([
            'nilais' => 'required|array',
            'nilais.*.siswa_id' => 'required|exists:siswas,id',
            'nilais.*.tujuan_pembelajaran_id' => 'required|exists:tujuan_pembelajarans,id',
            'nilais.*.nilai' => 'required|numeric|min:0|max:100',
            'nilais.*.catatan' => 'nullable|string',
        ]);

        $tahunAjaranAktif = \App\Models\TahunAjaran::where('is_active', true)->first();
        $semesterAktif = Semester::where('tahun_ajaran_id', $tahunAjaranAktif->id)->first();

        if (!$semesterAktif) {
            return redirect()->back()->withErrors(['error' => 'Semester aktif tidak ditemukan']);
        }

        foreach ($validated['nilais'] as $item) {
            Nilai::updateOrCreate(
                [
                    'siswa_id' => $item['siswa_id'],
                    'tujuan_pembelajaran_id' => $item['tujuan_pembelajaran_id'],
                    'kelas_id' => $penugasan->kelas_id,
                    'semester_id' => $semesterAktif->id,
                ],
                [
                    'guru_id' => $guru->id,
                    'nilai' => $item['nilai'],
                    'catatan' => $item['catatan'] ?? null,
                    'recorded_at' => now(),
                ]
            );
        }

        return redirect()->back()
            ->with('success', 'Nilai berhasil disimpan.');
    }

    public function update(Request $request, Nilai $nilai): RedirectResponse
    {
        $guru = $request->user()->guru;

        // Authorization: Pastikan nilai milik guru yang login
        if ($nilai->guru_id !== $guru->id) {
            abort(403);
        }

        $validated = $request->validate([
            'nilai' => 'required|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
        ]);

        $nilai->update([
            'nilai' => $validated['nilai'],
            'catatan' => $validated['catatan'] ?? null,
            'recorded_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Nilai berhasil diperbarui.');
    }
}
