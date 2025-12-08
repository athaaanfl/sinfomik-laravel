<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTahunAjaranRequest extends FormRequest
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
            'kode_tahun_ajaran' => ['required', 'string', 'unique:tahun_ajarans,kode_tahun_ajaran', 'max:255'],
            'tahunawal' => ['nullable', 'date'],
            'tahunakhir' => ['nullable', 'date', 'after:tahunawal'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'kode_tahun_ajaran' => 'kode tahun ajaran',
            'tahunawal' => 'tahun awal',
            'tahunakhir' => 'tahun akhir',
            'is_active' => 'status aktif',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'tahunakhir.after' => 'Tahun akhir harus setelah tahun awal.',
        ];
    }
}
