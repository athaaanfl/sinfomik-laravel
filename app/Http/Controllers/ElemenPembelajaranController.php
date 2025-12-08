<?php

namespace App\Http\Controllers;

use App\Models\ElemenPembelajaran;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElemenPembelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $elemens = ElemenPembelajaran::with('mataPelajaran')
            ->withCount('capaianPembelajarans')
            ->orderBy('mata_pelajaran_id')
            ->orderBy('urutan')
            ->paginate(15);

        return Inertia::render('elemen-pembelajaran/index', [
            'elemens' => $elemens,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mataPelajarans = MataPelajaran::orderBy('name')->get();

        return Inertia::render('elemen-pembelajaran/create', [
            'mataPelajarans' => $mataPelajarans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mata_pelajaran_id' => ['required', 'exists:mata_pelajarans,id'],
            'nama' => ['required', 'string', 'max:255'],
            'urutan' => ['required', 'integer', 'min:0'],
        ]);

        ElemenPembelajaran::create($validated);

        return redirect()->route('elemen-pembelajaran.index')
            ->with('success', 'Elemen pembelajaran berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ElemenPembelajaran $elemenPembelajaran)
    {
        $elemenPembelajaran->load([
            'mataPelajaran',
            'capaianPembelajarans' => function($query) {
                $query->orderBy('fase');
            }
        ]);

        return Inertia::render('elemen-pembelajaran/show', [
            'elemen' => $elemenPembelajaran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ElemenPembelajaran $elemenPembelajaran)
    {
        $mataPelajarans = MataPelajaran::orderBy('name')->get();

        return Inertia::render('elemen-pembelajaran/edit', [
            'elemen' => $elemenPembelajaran,
            'mataPelajarans' => $mataPelajarans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ElemenPembelajaran $elemenPembelajaran)
    {
        $validated = $request->validate([
            'mata_pelajaran_id' => ['required', 'exists:mata_pelajarans,id'],
            'nama' => ['required', 'string', 'max:255'],
            'urutan' => ['required', 'integer', 'min:0'],
        ]);

        $elemenPembelajaran->update($validated);

        return redirect()->route('elemen-pembelajaran.index')
            ->with('success', 'Elemen pembelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ElemenPembelajaran $elemenPembelajaran)
    {
        $elemenPembelajaran->delete();

        return redirect()->route('elemen-pembelajaran.index')
            ->with('success', 'Elemen pembelajaran berhasil dihapus.');
    }
}
