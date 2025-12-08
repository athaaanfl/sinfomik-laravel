<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSiswaRequest;
use App\Http\Requests\UpdateSiswaRequest;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    // Display a listing of the resource.
    public function index(): Response
    {
        $siswas = Siswa::latest()->paginate(10);

        return Inertia::render('siswa/index', [
            'siswas' => $siswas,
        ]);
    }

    // Show the form for creating a new resource.
    public function create(): Response
    {
        return Inertia::render('siswa/create');
    }

    // Store a newly created resource in storage.  
    public function store(StoreSiswaRequest $request): RedirectResponse
    {
        Siswa::create($request->validated());

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    // Display the specified resource.
    public function show(Siswa $siswa): Response
    {
        return Inertia::render('siswa/show', [
            'siswa' => $siswa,
        ]);
    }

    // Show the form for editing the specified resource.
    public function edit(Siswa $siswa): Response
    {
        return Inertia::render('siswa/edit', [
            'siswa' => $siswa,
        ]);
    }

    // Update the specified resource in storage.
    public function update(UpdateSiswaRequest $request, Siswa $siswa): RedirectResponse
    {
        $siswa->update($request->validated());

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    // Remove the specified resource from storage.
    public function destroy(Siswa $siswa): RedirectResponse
    {
        $siswa->delete();

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }
}
