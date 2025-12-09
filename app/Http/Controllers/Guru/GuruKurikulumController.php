<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuruKurikulumController extends Controller
{
    public function index(Request $request): Response
    {
        $guru = $request->user()->guru;

        // Ambil semua mata pelajaran yang diampu guru
        $mataPelajaranList = $guru->penugasanMengajars()
            ->with(['mataPelajaran.cpFases'])
            ->get()
            ->unique('mata_pelajaran_id')
            ->map(function ($penugasan) {
                $mapel = $penugasan->mataPelajaran;
                return [
                    'id' => $mapel->id,
                    'nama' => $mapel->name,
                    'deskripsi' => $mapel->deskripsi ?? null,
                    'jumlah_fase' => $mapel->cpFases->count(),
                ];
            })
            ->values();

        return Inertia::render('guru/kurikulum/index', [
            'mataPelajaranList' => $mataPelajaranList,
        ]);
    }

    public function show(Request $request, MataPelajaran $mataPelajaran): Response
    {
        $guru = $request->user()->guru;

        // Authorization: Cek apakah guru mengampu mata pelajaran ini
        $hasAccess = $guru->penugasanMengajars()
            ->where('mata_pelajaran_id', $mataPelajaran->id)
            ->exists();

        if (!$hasAccess) {
            abort(403, 'Anda tidak mengampu mata pelajaran ini.');
        }

        // Load full kurikulum hierarchy
        $mataPelajaran->load([
            'cpFases' => function ($query) {
                $query->orderBy('fase');
            },
            'cpFases.elemenPembelajarans' => function ($query) {
                $query->orderBy('urutan');
            },
            'cpFases.elemenPembelajarans.cpElemen',
            'cpFases.elemenPembelajarans.cpElemen.tujuanPembelajarans' => function ($query) {
                $query->orderBy('urutan');
            },
            'cpFases.elemenPembelajarans.cpElemen.tujuanPembelajarans.tpPemetaans.semester.tahunAjaran',
        ]);

        // Transform data untuk frontend
        $kurikulum = [
            'id' => $mataPelajaran->id,
            'nama' => $mataPelajaran->name,
            'deskripsi' => $mataPelajaran->description,
            'cp_fases' => $mataPelajaran->cpFases->map(function ($cpFase) {
                return [
                    'id' => $cpFase->id,
                    'fase' => $cpFase->fase,
                    'deskripsi' => $cpFase->deskripsi,
                    'elemen_pembelajarans' => $cpFase->elemenPembelajarans->map(function ($elemen) {
                        return [
                            'id' => $elemen->id,
                            'nama' => $elemen->nama,
                            'urutan' => $elemen->urutan,
                            'cp_elemen' => $elemen->cpElemen ? [
                                'id' => $elemen->cpElemen->id,
                                'deskripsi' => $elemen->cpElemen->deskripsi,
                                'tujuan_pembelajarans' => $elemen->cpElemen->tujuanPembelajarans->map(function ($tp) {
                                    return [
                                        'id' => $tp->id,
                                        'kode' => $tp->kode,
                                        'deskripsi' => $tp->deskripsi,
                                        'urutan' => $tp->urutan,
                                        'pemetaans' => $tp->tpPemetaans->map(function ($pemetaan) {
                                            return [
                                                'id' => $pemetaan->id,
                                                'tingkat' => $pemetaan->tingkat,
                                                'semester' => $pemetaan->semester->tipe,
                                                'tahun_ajaran' => $pemetaan->semester->tahunAjaran->nama,
                                            ];
                                        }),
                                    ];
                                }),
                            ] : null,
                        ];
                    }),
                ];
            }),
        ];

        return Inertia::render('guru/kurikulum/show', [
            'kurikulum' => $kurikulum,
        ]);
    }
}
