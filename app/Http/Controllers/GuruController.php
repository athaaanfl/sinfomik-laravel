<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreGuruRequest;
use App\Http\Requests\UpdateGuruRequest;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class GuruController extends Controller
{
    // Display a listing of the resource.
    public function index(): Response
    {
        $gurus = Guru::with('user')->latest()->paginate(10);

        return Inertia::render('guru/index', [
            'gurus' => $gurus,
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
}
