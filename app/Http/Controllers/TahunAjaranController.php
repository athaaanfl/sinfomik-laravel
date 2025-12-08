<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTahunAjaranRequest;
use App\Http\Requests\UpdateTahunAjaranRequest;
use App\Models\TahunAjaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TahunAjaranController extends Controller
{
    // Display a listing of the resource.
    public function index(): Response
    {
        $tahunAjarans = TahunAjaran::latest()->paginate(10);

        return Inertia::render('tahun-ajaran/index', [
            'tahunAjarans' => $tahunAjarans,
        ]);
    }

    // Show the form for creating a new resource.
    public function create(): Response
    {
        return Inertia::render('tahun-ajaran/create');
    }

    // Store a newly created resource in storage.
    public function store(StoreTahunAjaranRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            // If new tahun ajaran is active, deactivate others
            if ($request->is_active) {
                TahunAjaran::where('is_active', true)->update(['is_active' => false]);
            }

            TahunAjaran::create($request->validated());
        });

        return redirect()->route('tahun-ajaran.index')
            ->with('success', 'Data tahun ajaran berhasil ditambahkan.');
    }

    // Display the specified resource.
    public function show(TahunAjaran $tahunAjaran): Response
    {
        return Inertia::render('tahun-ajaran/show', [
            'tahunAjaran' => $tahunAjaran,
        ]);
    }

    // Show the form for editing the specified resource.
    public function edit(TahunAjaran $tahunAjaran): Response
    {
        return Inertia::render('tahun-ajaran/edit', [
            'tahunAjaran' => $tahunAjaran,
        ]);
    }

    // Update the specified resource in storage.
    public function update(UpdateTahunAjaranRequest $request, TahunAjaran $tahunAjaran): RedirectResponse
    {
        DB::transaction(function () use ($request, $tahunAjaran) {
            // If updating to active, deactivate others
            if ($request->is_active && !$tahunAjaran->is_active) {
                TahunAjaran::where('is_active', true)
                    ->where('id', '!=', $tahunAjaran->id)
                    ->update(['is_active' => false]);
            }

            $tahunAjaran->update($request->validated());
        });

        return redirect()->route('tahun-ajaran.index')
            ->with('success', 'Data tahun ajaran berhasil diperbarui.');
    }

    // Remove the specified resource from storage.
    public function destroy(TahunAjaran $tahunAjaran): RedirectResponse
    {
        $tahunAjaran->delete();

        return redirect()->route('tahun-ajaran.index')
            ->with('success', 'Data tahun ajaran berhasil dihapus.');
    }
}
