<?php

namespace App\Http\Controllers;

use App\Models\CapaianPembelajaran;
use App\Models\Semester;
use App\Models\TujuanPembelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TujuanPembelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tujuans = TujuanPembelajaran::with([
            'capaianPembelajaran.elemenPembelajaran.mataPelajaran'
        ])
            ->withCount('tpPemetaans')
            ->orderBy('capaian_pembelajaran_id')
            ->orderBy('urutan')
            ->paginate(15);

        return Inertia::render('tujuan-pembelajaran/index', [
            'tujuans' => $tujuans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $capaians = CapaianPembelajaran::with('elemenPembelajaran.mataPelajaran')
            ->orderBy('elemen_pembelajaran_id')
            ->orderBy('fase')
            ->get();

        return Inertia::render('tujuan-pembelajaran/create', [
            'capaians' => $capaians,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'capaian_pembelajaran_id' => ['required', 'exists:capaian_pembelajarans,id'],
            'kode' => ['nullable', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'urutan' => ['required', 'integer', 'min:0'],
            'pemetaans' => ['nullable', 'array'],
            'pemetaans.*.tingkat' => ['required', 'integer', 'min:1', 'max:6'],
            'pemetaans.*.semester_id' => ['required', 'exists:semesters,id'],
        ]);

        $tujuan = TujuanPembelajaran::create([
            'capaian_pembelajaran_id' => $validated['capaian_pembelajaran_id'],
            'kode' => $validated['kode'],
            'deskripsi' => $validated['deskripsi'],
            'urutan' => $validated['urutan'],
        ]);

        // Simpan pemetaan jika ada
        if (!empty($validated['pemetaans'])) {
            foreach ($validated['pemetaans'] as $pemetaan) {
                $tujuan->tpPemetaans()->create([
                    'tingkat' => $pemetaan['tingkat'],
                    'semester_id' => $pemetaan['semester_id'],
                ]);
            }
        }

        return redirect()->route('tujuan-pembelajaran.index')
            ->with('success', 'Tujuan pembelajaran berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TujuanPembelajaran $tujuanPembelajaran)
    {
        $tujuanPembelajaran->load([
            'capaianPembelajaran.elemenPembelajaran.mataPelajaran',
            'tpPemetaans.semester.tahunAjaran'
        ]);

        return Inertia::render('tujuan-pembelajaran/show', [
            'tujuan' => $tujuanPembelajaran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TujuanPembelajaran $tujuanPembelajaran)
    {
        $tujuanPembelajaran->load([
            'capaianPembelajaran.elemenPembelajaran.mataPelajaran',
            'tpPemetaans'
        ]);

        $capaians = CapaianPembelajaran::with('elemenPembelajaran.mataPelajaran')
            ->orderBy('elemen_pembelajaran_id')
            ->orderBy('fase')
            ->get();

        $semesters = Semester::with('tahunAjaran')
            ->orderBy('tahun_ajaran_id')
            ->orderBy('tipe')
            ->get();

        return Inertia::render('tujuan-pembelajaran/edit', [
            'tujuan' => $tujuanPembelajaran,
            'capaians' => $capaians,
            'semesters' => $semesters,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TujuanPembelajaran $tujuanPembelajaran)
    {
        $validated = $request->validate([
            'capaian_pembelajaran_id' => ['required', 'exists:capaian_pembelajarans,id'],
            'kode' => ['nullable', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'urutan' => ['required', 'integer', 'min:0'],
            'pemetaans' => ['nullable', 'array'],
            'pemetaans.*.tingkat' => ['required', 'integer', 'min:1', 'max:6'],
            'pemetaans.*.semester_id' => ['required', 'exists:semesters,id'],
        ]);

        $tujuanPembelajaran->update([
            'capaian_pembelajaran_id' => $validated['capaian_pembelajaran_id'],
            'kode' => $validated['kode'],
            'deskripsi' => $validated['deskripsi'],
            'urutan' => $validated['urutan'],
        ]);

        // Hapus pemetaan lama dan buat baru
        $tujuanPembelajaran->tpPemetaans()->delete();
        
        if (!empty($validated['pemetaans'])) {
            foreach ($validated['pemetaans'] as $pemetaan) {
                $tujuanPembelajaran->tpPemetaans()->create([
                    'tingkat' => $pemetaan['tingkat'],
                    'semester_id' => $pemetaan['semester_id'],
                ]);
            }
        }

        return redirect()->route('tujuan-pembelajaran.index')
            ->with('success', 'Tujuan pembelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TujuanPembelajaran $tujuanPembelajaran)
    {
        $tujuanPembelajaran->delete();

        return redirect()->route('tujuan-pembelajaran.index')
            ->with('success', 'Tujuan pembelajaran berhasil dihapus.');
    }
}
