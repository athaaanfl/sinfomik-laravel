<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMapelWaliKelasRequest extends FormRequest
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
            'mata_pelajaran_id' => ['required', 'exists:mata_pelajarans,id'],
            'tingkat_allowed' => ['required', 'array', 'min:1'],
            'tingkat_allowed.*' => ['integer', 'min:1', 'max:6'],
            'is_active' => ['boolean'],
            'urutan' => ['integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'mata_pelajaran_id.required' => 'Mata pelajaran harus dipilih',
            'mata_pelajaran_id.exists' => 'Mata pelajaran tidak ditemukan',
            'tingkat_allowed.required' => 'Minimal satu tingkat harus dipilih',
            'tingkat_allowed.array' => 'Tingkat harus berupa array',
            'tingkat_allowed.min' => 'Minimal satu tingkat harus dipilih',
        ];
    }
}
