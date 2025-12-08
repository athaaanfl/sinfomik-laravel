<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Guru;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'atha@binekas.sch.id'],
            [
                'name' => 'Muhammad Naufal Atha Al Khairi',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => UserRole::ADMIN,
            ]
        );
        $guruUser = User::updateOrCreate(
            ['email' => 'guntur@binekas.sch.id'],
            [
                'name' => 'Raihan Guntur Ramadhan',
                'password' => bcrypt('guruu123'),
                'email_verified_at' => now(),
                'role' => UserRole::GURU,
            ]
        );

        // Create guru record for the guru user
        Guru::firstOrCreate(
            ['user_id' => $guruUser->id],
        );

        // Seed Tahun Ajaran, Semester, dan Kelas
        $this->call([
            KelasMasterSeeder::class,
            TahunAjaranSemesterKelasSeeder::class,
            MataPelajaranSeeder::class,
            KurikulumCompleteSeeder::class, // Seed kurikulum lengkap
            GuruSeeder::class,
            SiswaSeeder::class,
        ]);
    }
}
