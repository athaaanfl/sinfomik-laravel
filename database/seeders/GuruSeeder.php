<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class GuruSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        
        // Generate 30 guru dengan data Indonesia
        for ($i = 1; $i <= 30; $i++) {
            $name = $faker->name();
            $email = strtolower(str_replace(' ', '.', $name)) . $i . '@binekas.sch.id';
            
            // Create user account for guru
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('guruu123'),
                'email_verified_at' => now(),
                'role' => UserRole::GURU,
            ]);

            // Create guru profile
            Guru::create([
                'user_id' => $user->id,
                'nip' => $faker->unique()->numerify('####################'), // 20 digits
                'gender' => $faker->randomElement(['laki-laki', 'perempuan']),
                'tanggal_lahir' => $faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
                'nomor_telepon' => '08' . $faker->numerify('##########'),
                'alamat' => $faker->address(),
                'kualifikasi' => $faker->randomElement(['S1', 'S2', 'S3']),
                'is_wali_kelas' => false,
            ]);
        }
    }
}
