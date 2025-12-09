<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\KelasMaster;
use App\Models\Siswa;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $tahunAjarans = \App\Models\TahunAjaran::orderBy('tahunawal', 'desc')->get();
        $selectedTahunAjaranId = $request->get('tahun_ajaran_id', $tahunAjarans->where('is_active', true)->first()?->id ?? $tahunAjarans->first()?->id);
        
        $kelas = Kelas::with(['tahunAjaran', 'guru.user'])
            ->where('tahun_ajaran_id', $selectedTahunAjaranId)
            ->withCount(['siswas as siswas_count' => function ($query) {
                $query->whereNull('kelas_siswa.end_date'); // Hanya hitung siswa aktif
            }])
            ->get()
            ->map(function ($kelas) {
                return [
                    'id' => $kelas->id,
                    'nama' => $kelas->nama,
                    'tingkat' => $kelas->tingkat,
                    'homeroom_teacher_id' => $kelas->homeroom_teacher_id,
                    'siswas_count' => $kelas->siswas_count,
                    'wali_kelas' => $kelas->guru && $kelas->guru->user ? [
                        'id' => $kelas->guru->id,
                        'nama' => $kelas->guru->user->name,
                        'nip' => $kelas->guru->nip,
                    ] : null,
                ];
            });
        
        $kelasByTingkat = $kelas->groupBy('tingkat');
        
        // Get existing kelas names and tingkat for this tahun ajaran
        $existingKelas = Kelas::where('tahun_ajaran_id', $selectedTahunAjaranId)
            ->get(['nama', 'tingkat'])
            ->map(fn($k) => ['nama' => $k->nama, 'tingkat' => $k->tingkat]);
        $kelasMasterBelumDibuat = collect();
        
        $gurus = \App\Models\Guru::with('user')->get()->map(function ($guru) {
            return [
                'id' => $guru->id,
                'nama' => $guru->user->name ?? '',
                'nip' => $guru->nip,
            ];
        });
        
        return Inertia::render('kelas/index', [
            'tahunAjarans' => $tahunAjarans,
            'selectedTahunAjaranId' => $selectedTahunAjaranId,
            'kelasByTingkat' => $kelasByTingkat,
            'kelasMasterBelumDibuat' => $kelasMasterBelumDibuat,
            'gurus' => $gurus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelas $kelas): Response
    {
        $kelas->load([
            'tahunAjaran',
            'guru.user',
            'siswas' => function ($query) {
                $query->withPivot(['start_date', 'end_date'])
                    ->orderBy('kelas_siswa.start_date', 'desc');
            }
        ]);
        
        // Get siswa yang sudah terdaftar di kelas aktif (end_date = null) pada tahun ajaran yang sama
        $siswaIdsInCurrentTahunAjaran = DB::table('kelas_siswa')
            ->join('kelas', 'kelas_siswa.kelas_id', '=', 'kelas.id')
            ->where('kelas.tahun_ajaran_id', $kelas->tahun_ajaran_id)
            ->whereNull('kelas_siswa.end_date') // Hanya yang masih aktif
            ->pluck('kelas_siswa.siswa_id')
            ->toArray();
        
        // Available siswa: status Aktif dan belum terdaftar di kelas manapun dalam tahun ajaran ini
        $availableSiswas = Siswa::where('status', 'Aktif')
            ->whereNotIn('id', $siswaIdsInCurrentTahunAjaran)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nis', 'nama_lengkap as nama']);
        
        // Transform siswa data with nama property
        $siswasWithNama = $kelas->siswas->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'nama' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'pivot' => [
                    'start_date' => $siswa->pivot->start_date,
                    'end_date' => $siswa->pivot->end_date,
                ],
            ];
        });
        
        // Get all gurus untuk dropdown wali kelas
        $allGurus = Guru::with('user')->get()->map(function ($guru) {
            return [
                'id' => $guru->id,
                'nama' => $guru->user->name ?? '',
                'nip' => $guru->nip,
            ];
        });

        return Inertia::render('kelas/show', [
            'kelas' => [
                'id' => $kelas->id,
                'nama' => $kelas->nama,
                'tingkat' => $kelas->tingkat,
                'homeroom_teacher_id' => $kelas->homeroom_teacher_id,
                'tahun_ajaran' => [
                    'id' => $kelas->tahunAjaran->id,
                    'tahun' => $kelas->tahunAjaran->kode_tahun_ajaran,
                    'kode_tahun_ajaran' => $kelas->tahunAjaran->kode_tahun_ajaran,
                ],
                'wali_kelas' => $kelas->guru && $kelas->guru->user ? [
                    'id' => $kelas->guru->id,
                    'nama' => $kelas->guru->user->name,
                    'nip' => $kelas->guru->nip,
                ] : null,
                'siswas' => $siswasWithNama,
            ],
            'availableSiswas' => $availableSiswas,
            'allGurus' => $allGurus,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kelas): RedirectResponse
    {
        $validated = $request->validate([
            'homeroom_teacher_id' => 'nullable|exists:gurus,id',
        ]);
        
        // Use assignWaliKelas method untuk trigger event
        $kelas->assignWaliKelas($validated['homeroom_teacher_id'], $kelas->tahun_ajaran_id);
        
        return redirect()->back()->with('success', 'Wali kelas berhasil diperbarui dan penugasan mata pelajaran telah dibuat.');
    }

    /**
     * Create a new class for a specific tahun ajaran.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
            'nama' => 'required|string|max:10',
            'tingkat' => 'required|integer|min:1|max:12',
            'homeroom_teacher_id' => 'nullable|exists:gurus,id',
        ]);

        // Check if kelas already exists for this tahun ajaran with same nama
        $exists = Kelas::where('tahun_ajaran_id', $validated['tahun_ajaran_id'])
            ->where('nama', $validated['nama'])
            ->exists();
        
        if ($exists) {
            return redirect()->back()->with('error', 'Kelas dengan nama tersebut sudah ada untuk tahun ajaran ini.');
        }

        Kelas::create($validated);

        return redirect()->back()->with('success', 'Kelas berhasil dibuat.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kelas): RedirectResponse
    {
        // Validasi: Cek apakah kelas memiliki siswa aktif
        $activeSiswaCount = $kelas->siswas()->wherePivot('end_date', null)->count();
        
        if ($activeSiswaCount > 0) {
            return redirect()->back()->with('error', 
                "Tidak dapat menghapus kelas karena masih memiliki {$activeSiswaCount} siswa aktif. Keluarkan semua siswa terlebih dahulu."
            );
        }
        
        $kelasNama = $kelas->tingkat . $kelas->nama;
        
        // Hapus relasi pivot siswa (data historis)
        $kelas->siswas()->detach();
        
        // Hapus kelas
        $kelas->delete();
        
        return redirect()->back()->with('success', 
            "Kelas {$kelasNama} berhasil dihapus."
        );
    }

    /**
     * Show the form for adding students to a class.
     */
    public function addStudentsForm(Kelas $kelas): Response
    {
        $kelas->load(['siswas']);
        
        // Get current siswa IDs in this class (active only)
        $currentSiswaIds = $kelas->siswas()->wherePivot('end_date', null)->pluck('siswa_id');
        
        // Get available siswas (aktif and not in this class)
        $availableSiswas = Siswa::where('status', 'Aktif')
            ->whereNotIn('id', $currentSiswaIds)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nis', 'nama_lengkap as nama']);
        
        return Inertia::render('kelas/add-students', [
            'kelas' => [
                'id' => $kelas->id,
                'nama' => $kelas->nama,
                'tingkat' => $kelas->tingkat,
            ],
            'availableSiswas' => $availableSiswas,
        ]);
    }

    /**
     * Add multiple students to a class.
     */
    public function addStudents(Request $request, Kelas $kelas): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_ids' => 'required|array',
            'siswa_ids.*' => 'exists:siswas,id',
        ]);

        $today = now()->format('Y-m-d');
        
        // Get siswa yang sudah terdaftar di kelas aktif dalam tahun ajaran yang sama
        $siswaIdsInCurrentTahunAjaran = DB::table('kelas_siswa')
            ->join('kelas', 'kelas_siswa.kelas_id', '=', 'kelas.id')
            ->where('kelas.tahun_ajaran_id', $kelas->tahun_ajaran_id)
            ->whereNull('kelas_siswa.end_date') // Hanya yang masih aktif
            ->pluck('kelas_siswa.siswa_id')
            ->toArray();
        
        $addedCount = 0;
        $skippedCount = 0;
        
        foreach ($validated['siswa_ids'] as $siswaId) {
            // Skip jika siswa sudah terdaftar di kelas manapun dalam tahun ajaran ini
            if (in_array($siswaId, $siswaIdsInCurrentTahunAjaran)) {
                $skippedCount++;
                continue;
            }
            
            $kelas->siswas()->attach($siswaId, [
                'start_date' => $today,
                'end_date' => null,
            ]);
            $addedCount++;
        }

        if ($addedCount > 0 && $skippedCount > 0) {
            return redirect()->route('kelas.show', $kelas)
                ->with('success', $addedCount . ' siswa berhasil ditambahkan. ' . $skippedCount . ' siswa dilewati karena sudah terdaftar di kelas lain.');
        } elseif ($addedCount > 0) {
            return redirect()->route('kelas.show', $kelas)
                ->with('success', $addedCount . ' siswa berhasil ditambahkan ke kelas.');
        }
        
        return redirect()->route('kelas.show', $kelas)
            ->with('info', 'Tidak ada siswa yang ditambahkan. Semua siswa sudah terdaftar di kelas dalam tahun ajaran ini.');
    }

    /**
     * Remove a student from a class by deleting the pivot record.
     */
    public function removeStudent(Kelas $kelas, Siswa $siswa): RedirectResponse
    {
        // Check if siswa is in this kelas
        $exists = $kelas->siswas()
            ->where('siswa_id', $siswa->id)
            ->exists();
        
        if (!$exists) {
            return redirect()->back()->with('error', 'Siswa tidak ditemukan di kelas ini.');
        }
        
        // Remove siswa from kelas (delete pivot record)
        $kelas->siswas()->detach($siswa->id);
        
        return redirect()->back()->with('success', 
            "Siswa {$siswa->nama_lengkap} berhasil dihapus dari kelas."
        );
    }

    /**
     * Generate kelas for a tahun ajaran from kelas_master.
     */
    public function generateFromMaster(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
        ]);

        $tahunAjaranId = $validated['tahun_ajaran_id'];

        // Get all kelas_master
        $kelasMasters = KelasMaster::all();

        if ($kelasMasters->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada kelas master yang tersedia. Tambahkan kelas master terlebih dahulu.');
        }

        // Get existing kelas for this tahun ajaran
        $existingKelas = Kelas::where('tahun_ajaran_id', $tahunAjaranId)
            ->get(['nama', 'tingkat'])
            ->map(fn($k) => $k->tingkat . '-' . $k->nama)
            ->toArray();

        $createdCount = 0;
        $skippedCount = 0;

        foreach ($kelasMasters as $master) {
            $key = $master->tingkat . '-' . $master->nama;

            // Skip if already exists
            if (in_array($key, $existingKelas)) {
                $skippedCount++;
                continue;
            }

            // Create new kelas
            Kelas::create([
                'tahun_ajaran_id' => $tahunAjaranId,
                'nama' => $master->nama,
                'tingkat' => $master->tingkat,
                'homeroom_teacher_id' => null,
            ]);

            $createdCount++;
        }

        if ($createdCount > 0) {
            $message = "{$createdCount} kelas berhasil digenerate dari kelas master.";
            if ($skippedCount > 0) {
                $message .= " ({$skippedCount} kelas sudah ada dan dilewati)";
            }
            return redirect()->back()->with('success', $message);
        }

        return redirect()->back()->with('info', 'Semua kelas dari kelas master sudah ada untuk tahun ajaran ini.');
    }
}
