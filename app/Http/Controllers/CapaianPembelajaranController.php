<?php

namespace App\Http\Controllers;

use App\Models\CapaianPembelajaran;
use App\Models\ElemenPembelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CapaianPembelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $capaians = CapaianPembelajaran::with(['elemenPembelajaran.mataPelajaran'])
            ->withCount('tujuanPembelajarans')
            ->orderBy('elemen_pembelajaran_id')
            ->orderBy('fase')
            ->paginate(15);

        return Inertia::render('capaian-pembelajaran/index', [
            'capaians' => $capaians,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $elemens = ElemenPembelajaran::with('mataPelajaran')
            ->orderBy('nama')
            ->get();

        return Inertia::render('capaian-pembelajaran/create', [
            'elemens' => $elemens,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'elemen_pembelajaran_id' => ['required', 'exists:elemen_pembelajarans,id'],
            'fase' => ['required', 'in:A,B,C'],
            'cp_fase' => ['required', 'string'],
            'cp_elemen' => ['required', 'string'],
        ]);

        CapaianPembelajaran::create($validated);

        return redirect()->route('capaian-pembelajaran.index')
            ->with('success', 'Capaian pembelajaran berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CapaianPembelajaran $capaianPembelajaran)
    {
        $capaianPembelajaran->load([
            'elemenPembelajaran.mataPelajaran',
            'tujuanPembelajarans' => function($query) {
                $query->orderBy('urutan');
            }
        ]);

        return Inertia::render('capaian-pembelajaran/show', [
            'capaian' => $capaianPembelajaran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CapaianPembelajaran $capaianPembelajaran)
    {
        $capaianPembelajaran->load('elemenPembelajaran.mataPelajaran');
        
        $elemens = ElemenPembelajaran::with('mataPelajaran')
            ->orderBy('nama')
            ->get();

        return Inertia::render('capaian-pembelajaran/edit', [
            'capaian' => $capaianPembelajaran,
            'elemens' => $elemens,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CapaianPembelajaran $capaianPembelajaran)
    {
        $validated = $request->validate([
            'elemen_pembelajaran_id' => ['required', 'exists:elemen_pembelajarans,id'],
            'fase' => ['required', 'in:A,B,C'],
            'cp_fase' => ['required', 'string'],
            'cp_elemen' => ['required', 'string'],
        ]);

        $capaianPembelajaran->update($validated);

        return redirect()->route('capaian-pembelajaran.index')
            ->with('success', 'Capaian pembelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CapaianPembelajaran $capaianPembelajaran)
    {
        $capaianPembelajaran->delete();

        return redirect()->route('capaian-pembelajaran.index')
            ->with('success', 'Capaian pembelajaran berhasil dihapus.');
    }
}
