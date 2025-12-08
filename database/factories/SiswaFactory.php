<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Siswa>
 */
class SiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => fake()->name(),
            'nama_panggilan' => fake()->firstName(),
            'nis' => fake()->unique()->numerify('##########'),
            'nisn' => fake()->unique()->numerify('##########'),
            'tahun_masuk' => fake()->year(),
            'status' => fake()->randomElement(['Aktif', 'Non Aktif']),
            'gender' => fake()->randomElement(['laki-laki', 'perempuan']),
            'tanggal_lahir' => fake()->date(),
            'tempat_lahir' => fake()->city(),
            'agama' => fake()->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']),
            'alamat' => fake()->address(),
            'nomor_telepon' => '08' . fake()->numerify('##########'), // 08 + 10 digits = 12 chars
            'nama_ayah' => fake()->name('male'),
            'nama_ibu' => fake()->name('female'),
            'nomor_telepon_wali' => '08' . fake()->numerify('##########'), // 08 + 10 digits = 12 chars
        ];
    }

    /**
     * Indicate that the siswa is active.
     */
    public function aktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Aktif',
        ]);
    }

    /**
     * Indicate that the siswa is non active.
     */
    public function nonAktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Non Aktif',
        ]);
    }
}
