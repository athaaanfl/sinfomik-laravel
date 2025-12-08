<?php

namespace Database\Seeders;

use App\Models\KelasMaster;
use Illuminate\Database\Seeder;

class KelasMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kelasData = [
            // Tingkat 1
            ['nama' => 'Gemujeng', 'tingkat' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Someah', 'tingkat' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Darehdeh', 'tingkat' => 1, 'created_at' => now(), 'updated_at' => now()],
            
            // Tingkat 2
            ['nama' => 'Gentur', 'tingkat' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Rancage', 'tingkat' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Daria', 'tingkat' => 2, 'created_at' => now(), 'updated_at' => now()],
            
            // Tingkat 3
            ['nama' => 'Calakan', 'tingkat' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Singer', 'tingkat' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Rancingeus', 'tingkat' => 3, 'created_at' => now(), 'updated_at' => now()],
            
            // Tingkat 4
            ['nama' => 'Jatmika', 'tingkat' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Gumanti', 'tingkat' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Marahmay', 'tingkat' => 4, 'created_at' => now(), 'updated_at' => now()],
            
            // Tingkat 5
            ['nama' => 'Rucita', 'tingkat' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Binangkit', 'tingkat' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Macakal', 'tingkat' => 5, 'created_at' => now(), 'updated_at' => now()],
            
            // Tingkat 6
            ['nama' => 'Gumilang', 'tingkat' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Sonagar', 'tingkat' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Parigel', 'tingkat' => 6, 'created_at' => now(), 'updated_at' => now()],
        ];

        KelasMaster::insert($kelasData);
    }
}
