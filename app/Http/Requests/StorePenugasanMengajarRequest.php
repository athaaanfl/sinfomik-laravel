<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TipePenugasan;

class StorePenugasanMengajarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'guru_id' => ['required', 'exists:gurus,id'],
            'mata_pelajaran_id' => ['required', 'exists:mata_pelajarans,id'],
            'tahun_ajaran_id' => ['required', 'exists:tahun_ajarans,id'],
            'scope' => ['required', 'in:semua,tingkat,kelas'],
            'tingkat_ids' => ['required_if:scope,tingkat', 'array'],
            'tingkat_ids.*' => ['integer', 'min:1', 'max:6'],
            'kelas_ids' => ['required_if:scope,kelas', 'array'],
            'kelas_ids.*' => ['exists:kelas,id'],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'guru_id.required' => 'Guru harus dipilih',
            'guru_id.exists' => 'Guru tidak ditemukan',
            'mata_pelajaran_id.required' => 'Mata pelajaran harus dipilih',
            'mata_pelajaran_id.exists' => 'Mata pelajaran tidak ditemukan',
            'tahun_ajaran_id.required' => 'Tahun ajaran harus dipilih',
            'tahun_ajaran_id.exists' => 'Tahun ajaran tidak ditemukan',
            'scope.required' => 'Scope penugasan harus dipilih',
            'scope.in' => 'Scope penugasan tidak valid',
            'tingkat_ids.required_if' => 'Tingkat harus dipilih jika scope adalah per tingkat',
            'kelas_ids.required_if' => 'Kelas harus dipilih jika scope adalah per kelas',
        ];
    }
}
