<?php

namespace Database\Seeders;

use App\Models\MataPelajaran;
use Illuminate\Database\Seeder;

class MataPelajaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mataPelajarans = [
            'Life Skills',
            'Bahasa Indonesia',
            'Music',
            'Sport',
            'Citizenship',
            'Materi Keputrian Keputraan',
            'Religion',
            'MATH',
            'IPAS',
            'Budaya Jabar',
            'Literasi',
        ];

        foreach ($mataPelajarans as $nama) {
            MataPelajaran::updateOrCreate(
                ['name' => $nama],
                ['slug' => \Illuminate\Support\Str::slug($nama)]
            );
        }
    }
}
