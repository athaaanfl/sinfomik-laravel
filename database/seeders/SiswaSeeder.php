<?php

namespace Database\Seeders;

use App\Models\Siswa;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        
        // Generate 360 siswa aktif dengan data Indonesia
        for ($i = 1; $i <= 360; $i++) {
            $gender = $faker->randomElement(['laki-laki', 'perempuan']);
            
            Siswa::create([
                'nama_lengkap' => $gender === 'laki-laki' ? $faker->name('male') : $faker->name('female'),
                'nama_panggilan' => $faker->firstName($gender === 'laki-laki' ? 'male' : 'female'),
                'nis' => $faker->unique()->numerify('##########'),
                'nisn' => $faker->unique()->numerify('##########'),
                'tahun_masuk' => $faker->numberBetween(2015, 2024),
                'status' => 'Aktif',
                'gender' => $gender,
                'tanggal_lahir' => $faker->dateTimeBetween('-18 years', '-6 years')->format('Y-m-d'),
                'tempat_lahir' => $faker->city(),
                'agama' => $faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']),
                'alamat' => $faker->address(),
                'nomor_telepon' => '08' . $faker->numerify('##########'),
                'nama_ayah' => $faker->name('male'),
                'nama_ibu' => $faker->name('female'),
                'nomor_telepon_wali' => '08' . $faker->numerify('##########'),
            ]);
        }
    }
}
