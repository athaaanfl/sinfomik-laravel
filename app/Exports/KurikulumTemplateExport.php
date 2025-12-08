<?php

namespace App\Exports;

use App\Models\MataPelajaran;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class KurikulumTemplateExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    public function collection()
    {
        // Data contoh untuk membantu user memahami format
        return collect([
            [
                'mata_pelajaran' => 'MATH',
                'fase' => 'A',
                'deskripsi_fase' => 'Pada akhir Fase A, peserta didik dapat menunjukkan pemahaman dan melakukan operasi bilangan cacah sampai 100.',
                'elemen_pembelajaran' => 'Bilangan',
                'urutan_elemen' => 1,
                'cp_elemen' => 'Peserta didik dapat memahami bilangan cacah sampai 100 serta operasi penjumlahan dan pengurangan.',
                'kode_tp' => 'TP.MAT.1.1',
                'deskripsi_tp' => 'Siswa dapat membilang bilangan 1 sampai 20',
                'urutan_tp' => 1,
                'tingkat' => 1,
                'semester' => 'Ganjil',
            ],
            [
                'mata_pelajaran' => '', // Kosongkan jika sama dengan baris sebelumnya
                'fase' => '', // Kosongkan jika sama dengan baris sebelumnya
                'deskripsi_fase' => '',
                'elemen_pembelajaran' => '', // Kosongkan jika sama dengan baris sebelumnya
                'urutan_elemen' => '',
                'cp_elemen' => '',
                'kode_tp' => 'TP.MAT.1.1',
                'deskripsi_tp' => 'Siswa dapat membilang bilangan 1 sampai 20',
                'urutan_tp' => 1,
                'tingkat' => 1,
                'semester' => 'Genap',
            ],
            [
                'mata_pelajaran' => '',
                'fase' => '',
                'deskripsi_fase' => '',
                'elemen_pembelajaran' => '',
                'urutan_elemen' => '',
                'cp_elemen' => '',
                'kode_tp' => 'TP.MAT.1.2',
                'deskripsi_tp' => 'Siswa dapat melakukan penjumlahan bilangan cacah sampai 20',
                'urutan_tp' => 2,
                'tingkat' => 1,
                'semester' => 'Ganjil',
            ],
            [
                'mata_pelajaran' => '',
                'fase' => '',
                'deskripsi_fase' => '',
                'elemen_pembelajaran' => 'Geometri',
                'urutan_elemen' => 2,
                'cp_elemen' => 'Peserta didik dapat mengenal dan mengelompokkan bangun datar sederhana.',
                'kode_tp' => 'TP.MAT.2.1',
                'deskripsi_tp' => 'Siswa dapat mengenal bentuk segitiga, persegi, dan lingkaran',
                'urutan_tp' => 1,
                'tingkat' => 1,
                'semester' => 'Genap',
            ],
            [
                'mata_pelajaran' => 'Bahasa Indonesia',
                'fase' => 'A',
                'deskripsi_fase' => 'Pada akhir Fase A, peserta didik mampu berbahasa Indonesia dengan baik.',
                'elemen_pembelajaran' => 'Menyimak dan Berbicara',
                'urutan_elemen' => 1,
                'cp_elemen' => 'Peserta didik mampu menyimak, memahami, dan merespons instruksi lisan sederhana.',
                'kode_tp' => 'TP.BI.1.1',
                'deskripsi_tp' => 'Siswa mampu menyimak instruksi sederhana dari guru',
                'urutan_tp' => 1,
                'tingkat' => 1,
                'semester' => 'Ganjil',
            ],
            // Baris kosong untuk user mulai mengisi
            ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''],
        ]);
    }

    public function headings(): array
    {
        return [
            'mata_pelajaran',
            'fase',
            'deskripsi_fase',
            'elemen_pembelajaran',
            'urutan_elemen',
            'cp_elemen',
            'kode_tp',
            'deskripsi_tp',
            'urutan_tp',
            'tingkat',
            'semester',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style untuk header (baris 1)
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
            // Style untuk contoh data (baris 2-6)
            '2:6' => [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E7E6E6'],
                ],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25,  // mata_pelajaran
            'B' => 8,   // fase
            'C' => 50,  // deskripsi_fase
            'D' => 30,  // elemen_pembelajaran
            'E' => 15,  // urutan_elemen
            'F' => 50,  // cp_elemen
            'G' => 15,  // kode_tp
            'H' => 60,  // deskripsi_tp
            'I' => 12,  // urutan_tp
            'J' => 10,  // tingkat
            'K' => 12,  // semester
        ];
    }
}
