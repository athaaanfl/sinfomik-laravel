<?php

namespace App\Http\Controllers;

use App\Models\MapelWaliKelas;
use App\Models\MataPelajaran;
use App\Http\Requests\UpdateMapelWaliKelasRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MapelWaliKelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mapelWaliKelas = MapelWaliKelas::ordered()->get();
        $allMataPelajaran = MataPelajaran::orderBy('name')->get();

        // Get mata pelajaran yang belum dikonfigurasi
        $configuredMapelIds = $mapelWaliKelas->pluck('mata_pelajaran_id');
        $availableMataPelajaran = $allMataPelajaran->filter(function ($mapel) use ($configuredMapelIds) {
            return !$configuredMapelIds->contains($mapel->id);
        })->values();

        return Inertia::render('penugasan-mengajar/konfigurasi-mapel-wali-kelas', [
            'mapelWaliKelas' => $mapelWaliKelas,
            'availableMataPelajaran' => $availableMataPelajaran,
            'allMataPelajaran' => $allMataPelajaran,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UpdateMapelWaliKelasRequest $request)
    {
        try {
            $validated = $request->validated();

            // Check if already exists
            $exists = MapelWaliKelas::where('mata_pelajaran_id', $validated['mata_pelajaran_id'])->exists();
            
            if ($exists) {
                return redirect()->back()
                    ->with('error', 'Mata pelajaran ini sudah dikonfigurasi');
            }

            // Get urutan terakhir
            $lastUrutan = MapelWaliKelas::max('urutan') ?? 0;

            MapelWaliKelas::create([
                'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                'tingkat_allowed' => $validated['tingkat_allowed'],
                'is_active' => $validated['is_active'] ?? true,
                'urutan' => $lastUrutan + 1,
            ]);

            return redirect()->route('mapel-wali-kelas.index')
                ->with('success', 'Berhasil menambahkan konfigurasi mata pelajaran wali kelas');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal menambahkan konfigurasi: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMapelWaliKelasRequest $request, MapelWaliKelas $mapelWaliKela)
    {
        try {
            $validated = $request->validated();

            $mapelWaliKela->update([
                'tingkat_allowed' => $validated['tingkat_allowed'],
                'is_active' => $validated['is_active'] ?? $mapelWaliKela->is_active,
                'urutan' => $validated['urutan'] ?? $mapelWaliKela->urutan,
            ]);

            return redirect()->route('mapel-wali-kelas.index')
                ->with('success', 'Berhasil memperbarui konfigurasi mata pelajaran wali kelas');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal memperbarui konfigurasi: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MapelWaliKelas $mapelWaliKela)
    {
        try {
            $mapelWaliKela->delete();

            return redirect()->route('mapel-wali-kelas.index')
                ->with('success', 'Berhasil menghapus konfigurasi mata pelajaran wali kelas');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal menghapus konfigurasi: ' . $e->getMessage());
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive(MapelWaliKelas $mapelWaliKela)
    {
        try {
            $mapelWaliKela->update([
                'is_active' => !$mapelWaliKela->is_active,
            ]);

            return redirect()->route('mapel-wali-kelas.index')
                ->with('success', 'Berhasil mengubah status mata pelajaran wali kelas');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal mengubah status: ' . $e->getMessage());
        }
    }

    /**
     * Update urutan (batch update)
     */
    public function updateUrutan(Request $request)
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:mapel_wali_kelas,id'],
            'items.*.urutan' => ['required', 'integer', 'min:0'],
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->items as $item) {
                MapelWaliKelas::where('id', $item['id'])
                    ->update(['urutan' => $item['urutan']]);
            }

            DB::commit();

            return redirect()->route('mapel-wali-kelas.index')
                ->with('success', 'Berhasil memperbarui urutan mata pelajaran');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Gagal memperbarui urutan: ' . $e->getMessage());
        }
    }
}
