<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\TahunAjaran;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KelulusanSiswaController extends Controller
{
    /**
     * Display graduation page with year selection
     */
    public function index(Request $request): Response
    {
        $tahunAjarans = TahunAjaran::orderBy('tahunawal', 'desc')->get();
        
        // Get available tingkat levels from selected tahun ajaran
        $availableTingkat = [];
        if ($request->has('tahun_ajaran_id')) {
            $availableTingkat = Kelas::where('tahun_ajaran_id', $request->tahun_ajaran_id)
                ->distinct()
                ->orderBy('tingkat', 'desc')
                ->pluck('tingkat')
                ->values()
                ->toArray();
        }
        
        return Inertia::render('akademik/kelulusan/index', [
            'tahunAjarans' => $tahunAjarans,
            'availableTingkat' => $availableTingkat,
            'selectedTahunAjaranId' => $request->tahun_ajaran_id,
        ]);
    }

    /**
     * Preview students eligible for graduation
     */
    public function preview(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
            'tingkat' => 'required|integer|min:1|max:12',
        ]);

        // Store in session for GET access
        session([
            'kelulusan_preview' => $validated
        ]);

        // Redirect to GET preview route
        return redirect()->route('kelulusan-siswa.preview');
    }

    /**
     * Show preview page (GET)
     */
    public function showPreview()
    {
        $data = session('kelulusan_preview');
        
        if (!$data) {
            return redirect()->route('kelulusan-siswa.index')
                ->with('error', 'Data tidak ditemukan. Silakan pilih tahun ajaran dan tingkat kembali.');
        }

        $tahunAjaran = TahunAjaran::findOrFail($data['tahun_ajaran_id']);
        $tingkat = $data['tingkat'];

        // Get next tahun ajaran for "tidak_lulus" students
        $nextTahunAjaran = TahunAjaran::where('tahunawal', '>', $tahunAjaran->tahunawal)
            ->orderBy('tahunawal', 'asc')
            ->first();

        // Check if classes exist in next year for same tingkat
        $nextYearHasClasses = false;
        if ($nextTahunAjaran) {
            $nextYearHasClasses = Kelas::where('tahun_ajaran_id', $nextTahunAjaran->id)
                ->where('tingkat', $tingkat)
                ->exists();
        }

        // Get all classes for this level and year
        $kelasIds = Kelas::where('tahun_ajaran_id', $tahunAjaran->id)
            ->where('tingkat', $tingkat)
            ->pluck('id');

        // Get students currently enrolled in these classes
        $siswas = Siswa::where('status', 'Aktif')
            ->whereHas('kelas', function ($query) use ($kelasIds) {
                $query->whereIn('kelas.id', $kelasIds)
                    ->whereNull('kelas_siswa.end_date'); // Currently enrolled
            })
            ->with(['kelas' => function ($query) use ($kelasIds) {
                $query->whereIn('kelas.id', $kelasIds)
                    ->whereNull('kelas_siswa.end_date')
                    ->with('tahunAjaran');
            }])
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($siswa) {
                $currentKelas = $siswa->kelas->first();
                return [
                    'id' => $siswa->id,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nis' => $siswa->nis,
                    'nisn' => $siswa->nisn,
                    'tahun_masuk' => $siswa->tahun_masuk,
                    'kelas_id' => $currentKelas->id ?? null,
                    'kelas_nama' => $currentKelas ? $currentKelas->tingkat . ' - ' . $currentKelas->nama : '-',
                    'kelas' => $currentKelas ? [
                        'id' => $currentKelas->id,
                        'nama' => $currentKelas->nama,
                        'tingkat' => $currentKelas->tingkat,
                    ] : null,
                ];
            })
            ->groupBy('kelas_nama');

        return Inertia::render('akademik/kelulusan/preview', [
            'tahunAjaran' => $tahunAjaran,
            'tingkat' => $tingkat,
            'siswasByKelas' => $siswas,
            'totalSiswa' => $siswas->flatten(1)->count(),
            'nextTahunAjaran' => $nextTahunAjaran,
            'nextYearHasClasses' => $nextYearHasClasses,
        ]);
    }

    /**
     * Process graduation for selected students
     */
    public function process(Request $request)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
            'tingkat' => 'required|integer',
            'tanggal_lulus' => 'required|date',
            'actions' => 'required|array',
            'actions.*.siswa_id' => 'required|exists:siswas,id',
            'actions.*.kelas_id' => 'required|exists:kelas,id',
            'actions.*.action' => 'required|in:lulus,tidak_lulus,keluar',
        ]);

        try {
            DB::beginTransaction();

            $tahunAjaran = TahunAjaran::findOrFail($request->tahun_ajaran_id);
            $tanggalLulus = $request->tanggal_lulus;
            $tahunLulus = date('Y', strtotime($tanggalLulus));
            $tingkat = $request->tingkat;

            // Get next tahun ajaran for "tidak_lulus" students
            $nextTahunAjaran = TahunAjaran::where('tahunawal', '>', $tahunAjaran->tahunawal)
                ->orderBy('tahunawal', 'asc')
                ->first();

            $lulusCount = 0;
            $tidakLulusCount = 0;
            $keluarCount = 0;

            foreach ($request->actions as $action) {
                $siswa = Siswa::findOrFail($action['siswa_id']);
                
                // Update end_date in kelas_siswa pivot
                $siswa->kelas()->updateExistingPivot($action['kelas_id'], [
                    'end_date' => $tanggalLulus,
                ]);

                switch ($action['action']) {
                    case 'lulus':
                        $siswa->update([
                            'status' => 'Lulus',
                            'tahun_lulus' => $tahunLulus,
                            'tanggal_lulus' => $tanggalLulus,
                        ]);
                        $lulusCount++;
                        break;

                    case 'tidak_lulus':
                        // Auto-assign ke kelas tingkat yang sama di tahun ajaran berikutnya
                        if ($nextTahunAjaran) {
                            // Cari kelas dengan tingkat yang sama di tahun ajaran baru
                            $nextKelas = Kelas::where('tahun_ajaran_id', $nextTahunAjaran->id)
                                ->where('tingkat', $tingkat)
                                ->first();

                            if ($nextKelas) {
                                // Assign siswa ke kelas baru (tinggal kelas)
                                $siswa->kelas()->attach($nextKelas->id, [
                                    'start_date' => $tanggalLulus,
                                    'end_date' => null,
                                ]);
                            }
                        }
                        // Siswa tetap aktif
                        $tidakLulusCount++;
                        break;

                    case 'keluar':
                        $siswa->update([
                            'status' => 'Keluar',
                        ]);
                        $keluarCount++;
                        break;
                }
            }

            DB::commit();

            $message = "Kelulusan berhasil diproses! ";
            $message .= "Lulus: {$lulusCount}, ";
            if ($tidakLulusCount > 0) {
                $message .= "Tidak Lulus (Tinggal Kelas): {$tidakLulusCount}, ";
            }
            $message .= "Keluar: {$keluarCount}";

            return redirect()->route('kelulusan-siswa.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('kelulusan-siswa.index')
                ->with('error', 'Gagal memproses kelulusan: ' . $e->getMessage());
        }
    }
}
