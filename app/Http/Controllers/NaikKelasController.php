<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\TahunAjaran;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NaikKelasController extends Controller
{
    /**
     * Display class promotion page
     */
    public function index(): Response
    {
        $tahunAjarans = TahunAjaran::orderBy('tahunawal', 'desc')->get();
        
        return Inertia::render('akademik/naik-kelas/index', [
            'tahunAjarans' => $tahunAjarans,
        ]);
    }

    /**
     * Preview students and class mapping for promotion
     */
    public function preview(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_asal_id' => 'required|exists:tahun_ajarans,id',
            'tahun_ajaran_tujuan_id' => 'required|exists:tahun_ajarans,id',
        ]);

        // Store in session for GET access
        session([
            'naik_kelas_preview' => $validated
        ]);

        // Redirect to GET preview route
        return redirect()->route('naik-kelas.preview');
    }

    /**
     * Show preview page (GET)
     */
    public function showPreview()
    {
        $data = session('naik_kelas_preview');
        
        if (!$data) {
            return redirect()->route('naik-kelas.index')
                ->with('error', 'Data tidak ditemukan. Silakan pilih tahun ajaran kembali.');
        }

        $tahunAjaranAsal = TahunAjaran::findOrFail($data['tahun_ajaran_asal_id']);
        $tahunAjaranTujuan = TahunAjaran::findOrFail($data['tahun_ajaran_tujuan_id']);

        // Get all classes from source year (exclude final grade)
        $kelasAsal = Kelas::where('tahun_ajaran_id', $tahunAjaranAsal->id)
            ->where('tingkat', '<', 12) // Exclude grade 12
            ->with(['siswas' => function ($query) {
                $query->whereNull('kelas_siswa.end_date')
                    ->where('siswas.status', 'Aktif')
                    ->orderBy('nama_lengkap');
            }])
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get();

        // Get available classes in target year grouped by tingkat
        $kelasTujuan = Kelas::where('tahun_ajaran_id', $tahunAjaranTujuan->id)
            ->orderBy('tingkat')
            ->orderBy('nama')
            ->get()
            ->groupBy('tingkat');

        // Create mapping suggestions
        $mappingSuggestions = [];
        foreach ($kelasAsal as $kelas) {
            $tingkatTujuan = $kelas->tingkat + 1;
            $availableClasses = $kelasTujuan->get($tingkatTujuan, collect());
            
            // Auto-suggest: same name if available, otherwise first available class
            $suggestedKelas = $availableClasses->firstWhere('nama', $kelas->nama) 
                ?? $availableClasses->first();

            $mappingSuggestions[] = [
                'kelas_asal_id' => $kelas->id,
                'kelas_asal_nama' => $kelas->tingkat . ' - ' . $kelas->nama,
                'kelas_asal' => [
                    'id' => $kelas->id,
                    'nama' => $kelas->nama,
                    'tingkat' => $kelas->tingkat,
                ],
                'tingkat_tujuan' => $tingkatTujuan,
                'available_classes' => $availableClasses->map(fn($k) => [
                    'id' => $k->id,
                    'nama' => $k->nama,
                    'tingkat' => $k->tingkat,
                    'nama_lengkap' => $k->tingkat . ' - ' . $k->nama,
                ])->values(),
                'suggested_kelas_id' => $suggestedKelas?->id,
                'jumlah_siswa' => $kelas->siswas->count(),
                'siswas' => $kelas->siswas->map(fn($s) => [
                    'id' => $s->id,
                    'nama_lengkap' => $s->nama_lengkap,
                    'nis' => $s->nis,
                    'nisn' => $s->nisn,
                ])->values(),
            ];
        }

        return Inertia::render('akademik/naik-kelas/preview', [
            'tahunAjaranAsal' => $tahunAjaranAsal,
            'tahunAjaranTujuan' => $tahunAjaranTujuan,
            'mappingSuggestions' => $mappingSuggestions,
            'kelasTujuan' => $kelasTujuan->map(fn($classes, $tingkat) => [
                'tingkat' => $tingkat,
                'classes' => $classes->map(fn($k) => [
                    'id' => $k->id,
                    'nama' => $k->nama,
                    'tingkat' => $k->tingkat,
                    'nama_lengkap' => $k->tingkat . ' - ' . $k->nama,
                ])->values(),
            ])->values(),
            'totalSiswa' => collect($mappingSuggestions)->sum('jumlah_siswa'),
        ]);
    }

    /**
     * Process class promotion with mapping and exclusions
     */
    public function process(Request $request)
    {
        $request->validate([
            'tahun_ajaran_asal_id' => 'required|exists:tahun_ajarans,id',
            'tahun_ajaran_tujuan_id' => 'required|exists:tahun_ajarans,id',
            'tanggal_akhir' => 'required|date',
            'tanggal_mulai' => 'required|date',
            'promotions' => 'required|array',
            'promotions.*.kelas_asal_id' => 'required|exists:kelas,id',
            'promotions.*.kelas_tujuan_id' => 'required|exists:kelas,id',
            'promotions.*.students' => 'required|array',
            'promotions.*.students.*.siswa_id' => 'required|exists:siswas,id',
            'promotions.*.students.*.action' => 'required|in:naik,tinggal,keluar',
        ]);

        try {
            DB::beginTransaction();

            $tanggalAkhir = $request->tanggal_akhir;
            $tanggalMulai = $request->tanggal_mulai;

            $naikCount = 0;
            $tinggalCount = 0;
            $keluarCount = 0;

            foreach ($request->promotions as $promotion) {
                $kelasAsal = Kelas::findOrFail($promotion['kelas_asal_id']);
                $kelasTujuan = Kelas::findOrFail($promotion['kelas_tujuan_id']);

                foreach ($promotion['students'] as $student) {
                    $siswa = Siswa::findOrFail($student['siswa_id']);

                    // Set end_date for old class
                    $siswa->kelas()->updateExistingPivot($kelasAsal->id, [
                        'end_date' => $tanggalAkhir,
                    ]);

                    switch ($student['action']) {
                        case 'naik':
                            // Assign to new class
                            $siswa->kelas()->attach($kelasTujuan->id, [
                                'start_date' => $tanggalMulai,
                                'end_date' => null,
                            ]);
                            $naikCount++;
                            break;

                        case 'tinggal':
                            // Find class with same tingkat in new year
                            $kelasTinggal = Kelas::where('tahun_ajaran_id', $request->tahun_ajaran_tujuan_id)
                                ->where('tingkat', $kelasAsal->tingkat)
                                ->first();

                            if ($kelasTinggal) {
                                $siswa->kelas()->attach($kelasTinggal->id, [
                                    'start_date' => $tanggalMulai,
                                    'end_date' => null,
                                ]);
                            }
                            $tinggalCount++;
                            break;

                        case 'keluar':
                            $siswa->update([
                                'status' => 'Keluar',
                            ]);
                            $keluarCount++;
                            break;
                    }
                }
            }

            DB::commit();

            $message = "Naik kelas berhasil diproses! ";
            $message .= "Naik kelas: {$naikCount}, ";
            $message .= "Tinggal kelas: {$tinggalCount}, ";
            $message .= "Keluar: {$keluarCount}";

            return redirect()->route('naik-kelas.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('naik-kelas.index')
                ->with('error', 'Gagal memproses naik kelas: ' . $e->getMessage());
        }
    }
}
