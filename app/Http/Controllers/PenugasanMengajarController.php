<?php

namespace App\Http\Controllers;

use App\Models\PenugasanMengajar;
use App\Models\Guru;
use App\Models\MataPelajaran;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Http\Requests\StorePenugasanMengajarRequest;
use App\Enums\TipePenugasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenugasanMengajarController extends Controller
{
    /**
     * Display a listing of the resource (Card-based per Guru)
     */
    public function index(Request $request)
    {
        $tahunAjaranId = $request->input('tahun_ajaran_id');
        
        // Jika tidak ada tahun ajaran dipilih, gunakan yang aktif
        if (!$tahunAjaranId) {
            $tahunAjaranAktif = TahunAjaran::where('is_active', true)->first();
            $tahunAjaranId = $tahunAjaranAktif?->id;
        }

        // Get all gurus yang punya penugasan
        $gurusWithPenugasan = Guru::whereHas('penugasanMengajars', function ($query) use ($tahunAjaranId) {
            $query->where('tahun_ajaran_id', $tahunAjaranId);
        })
        ->with(['penugasanMengajars' => function ($query) use ($tahunAjaranId) {
            $query->where('tahun_ajaran_id', $tahunAjaranId)
                ->with(['mataPelajaran', 'kelas']);
        }])
        ->get()
        ->map(function ($guru) {
            // Group penugasan by mata pelajaran
            $penugasanGrouped = $guru->penugasanMengajars->groupBy('mata_pelajaran_id')->map(function ($group) {
                $mataPelajaran = $group->first()->mataPelajaran;
                return [
                    'mata_pelajaran' => [
                        'id' => $mataPelajaran->id,
                        'nama' => $mataPelajaran->name,
                    ],
                    'jumlah_kelas' => $group->count(),
                    'kelas' => $group->map(function ($item) {
                        return [
                            'id' => $item->kelas->id,
                            'nama' => $item->kelas->nama_lengkap,
                            'tipe_penugasan' => $item->tipe_penugasan->label(),
                        ];
                    })->values(),
                    'tipe_penugasan' => $group->first()->tipe_penugasan->value,
                ];
            })->values();

            // Check if wali kelas
            $isWaliKelas = $guru->penugasanMengajars->contains(function ($p) {
                return $p->tipe_penugasan === TipePenugasan::WALI_KELAS;
            });

            $kelasWali = null;
            if ($isWaliKelas) {
                $penugasanWali = $guru->penugasanMengajars->first(function ($p) {
                    return $p->tipe_penugasan === TipePenugasan::WALI_KELAS;
                });
                $kelasWali = $penugasanWali?->kelas->nama_lengkap;
            }

            return [
                'id' => $guru->id,
                'nama' => $guru->nama,
                'nip' => $guru->nip,
                'is_wali_kelas' => $isWaliKelas,
                'kelas_wali' => $kelasWali,
                'penugasan' => $penugasanGrouped,
            ];
        });

        // Get data untuk form
        $tahunAjarans = TahunAjaran::orderBy('id', 'desc')->get();

        return Inertia::render('penugasan-mengajar/index', [
            'gurus' => $gurusWithPenugasan,
            'tahunAjarans' => $tahunAjarans,
            'selectedTahunAjaranId' => $tahunAjaranId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $gurus = Guru::with('user')->get()->sortBy('user.name')->map(function ($guru) {
            return [
                'id' => $guru->id,
                'nama' => $guru->user->name ?? '',
                'nip' => $guru->nip,
                'nama_lengkap' => ($guru->user->name ?? '') . ' - ' . $guru->nip,
            ];
        })->values();
        
        $mataPelajarans = MataPelajaran::orderBy('name')->get()->map(function ($mapel) {
            return [
                'id' => $mapel->id,
                'nama' => $mapel->name,
            ];
        });
        
        $tahunAjarans = TahunAjaran::orderBy('id', 'desc')->get();
        
        // Get tahun ajaran aktif sebagai default
        $tahunAjaranAktif = TahunAjaran::where('is_active', true)->first();

        // Get all kelas grouped by tingkat
        $kelasGrouped = Kelas::where('tahun_ajaran_id', $tahunAjaranAktif?->id)
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get()
            ->groupBy('tingkat')
            ->map(function ($group) {
                return $group->map(function ($kelas) {
                    return [
                        'id' => $kelas->id,
                        'nama' => $kelas->nama_lengkap,
                        'tingkat' => $kelas->tingkat,
                    ];
                });
            });

        return Inertia::render('penugasan-mengajar/create', [
            'gurus' => $gurus,
            'mataPelajarans' => $mataPelajarans,
            'tahunAjarans' => $tahunAjarans,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'kelasGrouped' => $kelasGrouped,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePenugasanMengajarRequest $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            $kelasList = [];

            // Determine kelas berdasarkan scope
            switch ($validated['scope']) {
                case 'semua':
                    $kelasList = Kelas::where('tahun_ajaran_id', $validated['tahun_ajaran_id'])->pluck('id');
                    break;

                case 'tingkat':
                    $kelasList = Kelas::where('tahun_ajaran_id', $validated['tahun_ajaran_id'])
                        ->whereIn('tingkat', $validated['tingkat_ids'])
                        ->pluck('id');
                    break;

                case 'kelas':
                    $kelasList = $validated['kelas_ids'];
                    break;
            }

            // Create penugasan untuk setiap kelas
            $created = 0;
            $skipped = 0;

            foreach ($kelasList as $kelasId) {
                // Check jika sudah ada penugasan yang sama
                $exists = PenugasanMengajar::where('guru_id', $validated['guru_id'])
                    ->where('mata_pelajaran_id', $validated['mata_pelajaran_id'])
                    ->where('kelas_id', $kelasId)
                    ->where('tahun_ajaran_id', $validated['tahun_ajaran_id'])
                    ->exists();

                if (!$exists) {
                    PenugasanMengajar::create([
                        'guru_id' => $validated['guru_id'],
                        'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                        'kelas_id' => $kelasId,
                        'tahun_ajaran_id' => $validated['tahun_ajaran_id'],
                        'tipe_penugasan' => TipePenugasan::BIDANG_STUDI,
                        'keterangan' => $validated['keterangan'] ?? null,
                    ]);
                    $created++;
                } else {
                    $skipped++;
                }
            }

            DB::commit();

            return redirect()->route('penugasan-mengajar.index')
                ->with('success', "Berhasil membuat {$created} penugasan mengajar" . 
                    ($skipped > 0 ? " ({$skipped} penugasan sudah ada sebelumnya)" : ""));

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal membuat penugasan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'penugasan_ids' => ['required', 'array'],
            'penugasan_ids.*' => ['exists:penugasan_mengajars,id'],
        ]);

        try {
            PenugasanMengajar::whereIn('id', $request->penugasan_ids)->delete();

            return redirect()->route('penugasan-mengajar.index')
                ->with('success', 'Berhasil menghapus penugasan mengajar');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal menghapus penugasan: ' . $e->getMessage());
        }
    }

    /**
     * Get kelas by tahun ajaran (for dynamic loading)
     */
    public function getKelasByTahunAjaran(Request $request)
    {
        $tahunAjaranId = $request->input('tahun_ajaran_id');

        $kelasGrouped = Kelas::where('tahun_ajaran_id', $tahunAjaranId)
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get()
            ->groupBy('tingkat')
            ->map(function ($group) {
                return $group->map(function ($kelas) {
                    return [
                        'id' => $kelas->id,
                        'nama' => $kelas->nama_lengkap,
                        'tingkat' => $kelas->tingkat,
                    ];
                });
            });

        return response()->json($kelasGrouped);
    }
}
