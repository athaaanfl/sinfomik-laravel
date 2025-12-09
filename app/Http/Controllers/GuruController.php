<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreGuruRequest;
use App\Http\Requests\UpdateGuruRequest;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class GuruController extends Controller
{
    // Display a listing of the resource.
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $gurus = Guru::query()
            ->with(['user', 'kelasWali'])
            ->withCount('kelasWali')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nip', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($guru) {
                return [
                    'id' => $guru->id,
                    'nip' => $guru->nip,
                    'gender' => $guru->gender,
                    'nomor_telepon' => $guru->nomor_telepon,
                    'is_wali_kelas' => $guru->kelas_wali_count > 0,
                    'user' => $guru->user ? [
                        'name' => $guru->user->name,
                        'email' => $guru->user->email,
                    ] : null,
                ];
            });

        return Inertia::render('guru/index', [
            'gurus' => $gurus,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Show the form for creating a new resource.
    public function create(): Response
    {
        return Inertia::render('guru/create');
    }

    // Store a newly created resource in storage.
    public function store(StoreGuruRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            // Create user account first
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => UserRole::GURU,
            ]);

            // Create guru with the new user_id
            Guru::create([
                'user_id' => $user->id,
                'nip' => $request->nip,
                'gender' => $request->gender,
                'tanggal_lahir' => $request->tanggal_lahir,
                'nomor_telepon' => $request->nomor_telepon,
                'alamat' => $request->alamat,
                'kualifikasi' => $request->kualifikasi,
                'is_wali_kelas' => $request->is_wali_kelas ?? false,
            ]);
        });

        return redirect()->route('guru.index')
            ->with('success', 'Data guru berhasil ditambahkan.');
    }

    // Display the specified resource.
    public function show(Guru $guru): Response
    {
        $guru->load('user');

        return Inertia::render('guru/show', [
            'guru' => $guru,
        ]);
    }

    // Show the form for editing the specified resource.
    public function edit(Guru $guru): Response
    {
        $guru->load('user');
        $users = \App\Models\User::all();

        return Inertia::render('guru/edit', [
            'guru' => $guru,
            'users' => $users,
        ]);
    }

    // Update the specified resource in storage.
    public function update(UpdateGuruRequest $request, Guru $guru): RedirectResponse
    {
        $guru->update($request->validated());

        return redirect()->route('guru.index')
            ->with('success', 'Data guru berhasil diperbarui.');
    }

    // Remove the specified resource from storage.
    public function destroy(Guru $guru): RedirectResponse
    {
        // Check if guru has penugasan mengajar
        if ($guru->penugasanMengajars()->exists()) {
            return redirect()->route('guru.index')
                ->with('error', 'Guru tidak dapat dihapus karena masih memiliki penugasan mengajar.');
        }

        // Check if guru is wali kelas
        if ($guru->kelasWali()->exists()) {
            return redirect()->route('guru.index')
                ->with('error', 'Guru tidak dapat dihapus karena masih menjadi wali kelas.');
        }

        DB::transaction(function () use ($guru) {
            $user = $guru->user;
            $guru->delete();
            if ($user) {
                $user->delete();
            }
        });

        return redirect()->route('guru.index')
            ->with('success', 'Data guru berhasil dihapus.');
    }

    // Bulk delete gurus
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->input('ids', []);
        
        if (empty($ids)) {
            return redirect()->route('guru.index')
                ->with('error', 'Tidak ada guru yang dipilih.');
        }

        $gurus = Guru::whereIn('id', $ids)->with('user')->get();
        $deleted = 0;
        $errors = [];

        foreach ($gurus as $guru) {
            // Check if guru has penugasan mengajar
            if ($guru->penugasanMengajars()->exists()) {
                $errors[] = "{$guru->user->name} masih memiliki penugasan mengajar";
                continue;
            }

            // Check if guru is wali kelas
            if ($guru->kelasWali()->exists()) {
                $errors[] = "{$guru->user->name} masih menjadi wali kelas";
                continue;
            }

            DB::transaction(function () use ($guru) {
                $user = $guru->user;
                $guru->delete();
                if ($user) {
                    $user->delete();
                }
            });
            $deleted++;
        }

        if (!empty($errors)) {
            return redirect()->route('guru.index')
                ->with('error', 'Beberapa guru tidak dapat dihapus: ' . implode(', ', $errors));
        }

        return redirect()->route('guru.index')
            ->with('success', "{$deleted} guru berhasil dihapus.");
    }
}
