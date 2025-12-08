<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuruRequest extends FormRequest
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
            'user_id' => ['required', 'exists:users,id'],
            'nip' => ['nullable', 'string', 'unique:gurus,nip,' . $this->guru->id, 'max:255'],
            'gender' => ['required', 'in:laki-laki,perempuan'],
            'tanggal_lahir' => ['nullable', 'date'],
            'nomor_telepon' => ['nullable', 'string', 'max:15'],
            'alamat' => ['nullable', 'string'],
            'kualifikasi' => ['nullable', 'string', 'max:255'],
            'is_wali_kelas' => ['boolean'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'user',
            'nip' => 'NIP',
            'gender' => 'jenis kelamin',
            'tanggal_lahir' => 'tanggal lahir',
            'nomor_telepon' => 'nomor telepon',
            'alamat' => 'alamat',
            'kualifikasi' => 'kualifikasi',
            'is_wali_kelas' => 'wali kelas',
        ];
    }
}
