<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\Kelas;

class TahunAjaranSemesterKelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat Tahun Ajaran 2024/2025
        $tahunAjaran = TahunAjaran::firstOrCreate(
            ['kode_tahun_ajaran' => '2024/2025'],
            [
                'tahunawal' => '2024-07-15',
                'tahunakhir' => '2025-06-20',
                'is_active' => true,
            ]
        );

        // Buat Semester Ganjil dan Genap
        $semesterGanjil = Semester::firstOrCreate([
            'tahun_ajaran_id' => $tahunAjaran->id,
            'tipe' => 'Ganjil',
        ]);

        $semesterGenap = Semester::firstOrCreate([
            'tahun_ajaran_id' => $tahunAjaran->id,
            'tipe' => 'Genap',
        ]);

        // Data Kelas dengan Tingkat dan Nama
        $kelasData = [
            // Tingkat 1
            ['nama' => 'Gemujeng', 'tingkat' => 1],
            ['nama' => 'Someah', 'tingkat' => 1],
            ['nama' => 'Darehdeh', 'tingkat' => 1],
            // Tingkat 2
            ['nama' => 'Gentur', 'tingkat' => 2],
            ['nama' => 'Rancage', 'tingkat' => 2],
            ['nama' => 'Daria', 'tingkat' => 2],
            // Tingkat 3
            ['nama' => 'Calakan', 'tingkat' => 3],
            ['nama' => 'Singer', 'tingkat' => 3],
            ['nama' => 'Rancingeus', 'tingkat' => 3],
            // Tingkat 4
            ['nama' => 'Jatmika', 'tingkat' => 4],
            ['nama' => 'Gumanti', 'tingkat' => 4],
            ['nama' => 'Marahmay', 'tingkat' => 4],
            // Tingkat 5
            ['nama' => 'Rucita', 'tingkat' => 5],
            ['nama' => 'Binangkit', 'tingkat' => 5],
            ['nama' => 'Macakal', 'tingkat' => 5],
            // Tingkat 6
            ['nama' => 'Gumilang', 'tingkat' => 6],
            ['nama' => 'Sonagar', 'tingkat' => 6],
            ['nama' => 'Parigel', 'tingkat' => 6],
        ];

        // Buat Kelas untuk Tahun Ajaran 2024/2025
        foreach ($kelasData as $kelas) {
            Kelas::firstOrCreate([
                'tahun_ajaran_id' => $tahunAjaran->id,
                'nama' => $kelas['nama'],
            ], [
                'tingkat' => $kelas['tingkat'],
            ]);
        }

        $this->command->info('✓ Tahun Ajaran 2024/2025 created');
        $this->command->info('✓ Semester Ganjil & Genap created');
        $this->command->info('✓ ' . count($kelasData) . ' Kelas created');
    }
}
