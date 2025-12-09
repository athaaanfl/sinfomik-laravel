<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSiswaRequest;
use App\Http\Requests\UpdateSiswaRequest;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    // Display a listing of the resource.
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $siswas = Siswa::query()
            ->with(['kelas' => function ($query) {
                $query->whereNull('kelas_siswa.end_date')
                    ->with('tahunAjaran')
                    ->select('kelas.id', 'kelas.nama', 'kelas.tingkat', 'kelas.tahun_ajaran_id');
            }])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nis', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nama_panggilan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($siswa) {
                $activeKelas = $siswa->kelas->first();
                return [
                    'id' => $siswa->id,
                    'nis' => $siswa->nis,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nama_panggilan' => $siswa->nama_panggilan,
                    'gender' => $siswa->gender,
                    'tahun_masuk' => $siswa->tahun_masuk,
                    'status' => $siswa->status,
                    'kelas_aktif' => $activeKelas ? [
                        'id' => $activeKelas->id,
                        'nama_lengkap' => $activeKelas->tingkat . ' - ' . $activeKelas->nama,
                        'tahun_ajaran' => $activeKelas->tahunAjaran->kode_tahun_ajaran ?? '-',
                    ] : null,
                ];
            });

        return Inertia::render('siswa/index', [
            'siswas' => $siswas,
            'filters' => [
                'search' => $search,
            ],
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
        // Validate: Check if siswa has nilai (grades)
        if ($siswa->nilais()->exists()) {
            return redirect()->route('siswa.index')
                ->with('error', 'Tidak dapat menghapus siswa yang sudah memiliki data nilai.');
        }

        // Validate: Check if siswa is enrolled in any kelas
        if ($siswa->kelas()->exists()) {
            return redirect()->route('siswa.index')
                ->with('error', 'Tidak dapat menghapus siswa yang sudah terdaftar di kelas.');
        }

        $siswa->delete();

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }

    // Bulk delete siswas
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:siswas,id',
        ]);

        $ids = $request->input('ids');

        // Check if any siswa has nilai
        $siswaWithNilai = Siswa::whereIn('id', $ids)
            ->whereHas('nilais')
            ->pluck('nama_lengkap');

        if ($siswaWithNilai->isNotEmpty()) {
            return redirect()->route('siswa.index')
                ->with('error', 'Tidak dapat menghapus siswa berikut karena memiliki data nilai: ' . $siswaWithNilai->join(', '));
        }

        // Check if any siswa is enrolled in kelas
        $siswaInKelas = Siswa::whereIn('id', $ids)
            ->whereHas('kelas')
            ->pluck('nama_lengkap');

        if ($siswaInKelas->isNotEmpty()) {
            return redirect()->route('siswa.index')
                ->with('error', 'Tidak dapat menghapus siswa berikut karena sudah terdaftar di kelas: ' . $siswaInKelas->join(', '));
        }

        Siswa::whereIn('id', $ids)->delete();

        return redirect()->route('siswa.index')
            ->with('success', count($ids) . ' siswa berhasil dihapus.');
    }
}
