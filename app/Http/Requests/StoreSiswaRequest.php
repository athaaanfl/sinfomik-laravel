<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiswaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nama_panggilan' => ['nullable', 'string', 'max:255'],
            'nis' => ['nullable', 'string', 'unique:siswas,nis', 'max:255'],
            'nisn' => ['nullable', 'string', 'unique:siswas,nisn', 'max:15'],
            'tahun_masuk' => ['required', 'integer', 'digits:4'],
            'status' => ['required', 'in:Aktif,Non Aktif'],
            'gender' => ['required', 'in:laki-laki,perempuan'],
            'tanggal_lahir' => ['nullable', 'date'],
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'agama' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:15'],
            'nama_ayah' => ['nullable', 'string', 'max:255'],
            'nama_ibu' => ['nullable', 'string', 'max:255'],
            'nomor_telepon_wali' => ['nullable', 'string', 'max:15'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'nama_lengkap' => 'nama lengkap',
            'nama_panggilan' => 'nama panggilan',
            'nis' => 'NIS',
            'nisn' => 'NISN',
            'tahun_masuk' => 'tahun masuk',
            'status' => 'status',
            'gender' => 'jenis kelamin',
            'tanggal_lahir' => 'tanggal lahir',
            'tempat_lahir' => 'tempat lahir',
            'agama' => 'agama',
            'alamat' => 'alamat',
            'nomor_telepon' => 'nomor telepon',
            'nama_ayah' => 'nama ayah',
            'nama_ibu' => 'nama ibu',
            'nomor_telepon_wali' => 'nomor telepon wali',
        ];
    }
}
