<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMataPelajaranRequest;
use App\Http\Requests\UpdateMataPelajaranRequest;
use App\Models\MataPelajaran;
use App\Models\CpFase;
use App\Models\ElemenPembelajaran;
use App\Models\CpElemen;
use App\Models\TujuanPembelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MataPelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mataPelajarans = MataPelajaran::with([
            'cpFases' => function($query) {
                $query->orderBy('fase');
            },
            'cpFases.elemenPembelajarans' => function($query) {
                $query->orderBy('urutan');
            },
            'cpFases.elemenPembelajarans.cpElemen',
            'cpFases.elemenPembelajarans.cpElemen.tujuanPembelajarans' => function($query) {
                $query->orderBy('urutan');
            },
            'cpFases.elemenPembelajarans.cpElemen.tujuanPembelajarans.tpPemetaans.semester.tahunAjaran'
        ])
            ->orderBy('name')
            ->get();

        $semesters = \App\Models\Semester::with('tahunAjaran')
            ->orderBy('tahun_ajaran_id', 'desc')
            ->orderBy('tipe')
            ->get();

        return Inertia::render('mata-pelajaran/index', [
            'mataPelajarans' => $mataPelajarans,
            'semesters' => $semesters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('mata-pelajaran/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMataPelajaranRequest $request)
    {
        $validated = $request->validated();
        
        // Auto-generate slug dari nama
        $validated['slug'] = Str::slug($validated['name']);
        
        MataPelajaran::create($validated);

        return redirect()->route('mata-pelajaran.index')
            ->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->load(['elemenPembelajarans' => function($query) {
            $query->orderBy('urutan');
        }]);

        return Inertia::render('mata-pelajaran/show', [
            'mataPelajaran' => $mataPelajaran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MataPelajaran $mataPelajaran)
    {
        return Inertia::render('mata-pelajaran/edit', [
            'mataPelajaran' => $mataPelajaran,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMataPelajaranRequest $request, MataPelajaran $mataPelajaran)
    {
        $validated = $request->validated();
        
        // Auto-generate slug dari nama jika nama berubah
        if ($validated['name'] !== $mataPelajaran->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $mataPelajaran->update($validated);

        return redirect()->route('mata-pelajaran.index')
            ->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->delete();

        return redirect()->route('mata-pelajaran.index')
            ->with('success', 'Mata pelajaran berhasil dihapus.');
    }

    // CP Fase Methods
    public function storeCpFase(Request $request)
    {
        $validated = $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'fase' => 'required|in:A,B,C',
            'deskripsi' => 'required|string',
        ]);

        CpFase::create($validated);

        return redirect()->back()
            ->with('success', 'CP Fase berhasil ditambahkan.');
    }

    public function updateCpFase(Request $request, $id)
    {
        $validated = $request->validate([
            'fase' => 'required|in:A,B,C',
            'deskripsi' => 'required|string',
        ]);

        $cpFase = CpFase::findOrFail($id);
        $cpFase->update($validated);

        return redirect()->back()
            ->with('success', 'CP Fase berhasil diperbarui.');
    }

    public function destroyCpFase($id)
    {
        $cpFase = CpFase::findOrFail($id);
        $cpFase->delete();

        return redirect()->back()
            ->with('success', 'CP Fase berhasil dihapus.');
    }

    // Elemen Pembelajaran Methods
    public function storeElemen(Request $request)
    {
        $validated = $request->validate([
            'cp_fase_id' => 'required|exists:cp_fases,id',
            'nama' => 'required|string|max:255',
            'urutan' => 'required|integer|min:1',
        ]);

        ElemenPembelajaran::create($validated);

        return redirect()->back()
            ->with('success', 'Elemen Pembelajaran berhasil ditambahkan.');
    }

    public function updateElemen(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'urutan' => 'required|integer|min:1',
        ]);

        $elemen = ElemenPembelajaran::findOrFail($id);
        $elemen->update($validated);

        return redirect()->back()
            ->with('success', 'Elemen Pembelajaran berhasil diperbarui.');
    }

    public function destroyElemen($id)
    {
        $elemen = ElemenPembelajaran::findOrFail($id);
        $elemen->delete();

        return redirect()->back()
            ->with('success', 'Elemen Pembelajaran berhasil dihapus.');
    }

    // CP Elemen Methods
    public function storeCpElemen(Request $request)
    {
        $validated = $request->validate([
            'elemen_pembelajaran_id' => 'required|exists:elemen_pembelajarans,id',
            'deskripsi' => 'required|string',
        ]);

        CpElemen::create($validated);

        return redirect()->back()
            ->with('success', 'CP Elemen berhasil ditambahkan.');
    }

    public function updateCpElemen(Request $request, $id)
    {
        $validated = $request->validate([
            'deskripsi' => 'required|string',
        ]);

        $cpElemen = CpElemen::findOrFail($id);
        $cpElemen->update($validated);

        return redirect()->back()
            ->with('success', 'CP Elemen berhasil diperbarui.');
    }

    public function destroyCpElemen($id)
    {
        $cpElemen = CpElemen::findOrFail($id);
        $cpElemen->delete();

        return redirect()->back()
            ->with('success', 'CP Elemen berhasil dihapus.');
    }

    // Tujuan Pembelajaran Methods
    public function storeTp(Request $request)
    {
        $validated = $request->validate([
            'cp_elemen_id' => 'required|exists:cp_elemens,id',
            'deskripsi' => 'required|string',
            'urutan' => 'required|integer|min:1',
            'pemetaans' => 'required|array|min:1',
            'pemetaans.*.tingkat' => 'required|integer|min:1|max:6',
            'pemetaans.*.semester_id' => 'required|exists:semesters,id',
        ]);

        // Get mata pelajaran info untuk generate kode
        $cpElemen = CpElemen::with('elemenPembelajaran.cpFase.mataPelajaran')->findOrFail($validated['cp_elemen_id']);
        $mataPelajaran = $cpElemen->elemenPembelajaran->cpFase->mataPelajaran;
        
        // Ambil singkatan mata pelajaran (3 huruf pertama uppercase)
        $mapelCode = strtoupper(substr($mataPelajaran->name, 0, 3));
        
        // Generate kode: MAPEL-TINGKAT-URUTAN (format: MTK-1-01)
        // Ambil tingkat pertama dari pemetaans
        $tingkat = $validated['pemetaans'][0]['tingkat'];
        $kode = sprintf('%s-%d-%02d', $mapelCode, $tingkat, $validated['urutan']);

        $tp = TujuanPembelajaran::create([
            'cp_elemen_id' => $validated['cp_elemen_id'],
            'kode' => $kode,
            'deskripsi' => $validated['deskripsi'],
            'urutan' => $validated['urutan'],
        ]);

        // Simpan pemetaan
        if (isset($validated['pemetaans'])) {
            foreach ($validated['pemetaans'] as $pemetaan) {
                \App\Models\TPPemetaan::create([
                    'tujuan_pembelajaran_id' => $tp->id,
                    'tingkat' => $pemetaan['tingkat'],
                    'semester_id' => $pemetaan['semester_id'],
                ]);
            }
        }

        return redirect()->back()
            ->with('success', 'Tujuan Pembelajaran berhasil ditambahkan.');
    }

    public function updateTp(Request $request, $id)
    {
        $validated = $request->validate([
            'deskripsi' => 'required|string',
            'urutan' => 'required|integer|min:1',
            'pemetaans' => 'required|array|min:1',
            'pemetaans.*.tingkat' => 'required|integer|min:1|max:6',
            'pemetaans.*.semester_id' => 'required|exists:semesters,id',
        ]);

        $tp = TujuanPembelajaran::with('cpElemen.elemenPembelajaran.cpFase.mataPelajaran')->findOrFail($id);
        
        // Generate kode ulang
        $mataPelajaran = $tp->cpElemen->elemenPembelajaran->cpFase->mataPelajaran;
        $mapelCode = strtoupper(substr($mataPelajaran->name, 0, 3));
        $tingkat = $validated['pemetaans'][0]['tingkat'];
        $kode = sprintf('%s-%d-%02d', $mapelCode, $tingkat, $validated['urutan']);
        
        $tp->update([
            'kode' => $kode,
            'deskripsi' => $validated['deskripsi'],
            'urutan' => $validated['urutan'],
        ]);

        // Delete pemetaan lama dan buat yang baru
        \App\Models\TPPemetaan::where('tujuan_pembelajaran_id', $tp->id)->delete();
        
        if (isset($validated['pemetaans'])) {
            foreach ($validated['pemetaans'] as $pemetaan) {
                \App\Models\TPPemetaan::create([
                    'tujuan_pembelajaran_id' => $tp->id,
                    'tingkat' => $pemetaan['tingkat'],
                    'semester_id' => $pemetaan['semester_id'],
                ]);
            }
        }

        return redirect()->back()
            ->with('success', 'Tujuan Pembelajaran berhasil diperbarui.');
    }

    public function destroyTp($id)
    {
        $tp = TujuanPembelajaran::findOrFail($id);
        $tp->delete();

        return redirect()->back()
            ->with('success', 'Tujuan Pembelajaran berhasil dihapus.');
    }
}
