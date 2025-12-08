<?php

namespace App\Imports;

use App\Models\MataPelajaran;
use App\Models\CpFase;
use App\Models\ElemenPembelajaran;
use App\Models\CpElemen;
use App\Models\TujuanPembelajaran;
use App\Models\TPPemetaan;
use App\Models\Semester;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class KurikulumImport implements ToCollection, WithHeadingRow
{
    protected $results = [
        'success' => 0,
        'errors' => [],
        'warnings' => [],
    ];

    public function collection(Collection $rows)
    {
        $semesters = Semester::all();
        $currentMataPelajaran = null;
        $currentCpFase = null;
        $currentElemenPembelajaran = null;
        $currentCpElemen = null;

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // +2 karena index 0 + 1 header row

            try {
                // Skip row kosong
                if ($this->isRowEmpty($row)) {
                    continue;
                }

                // Ambil nilai dari row
                $mataPelajaranName = trim($row['mata_pelajaran'] ?? '');
                $fase = trim($row['fase'] ?? '');
                $faseDeskripsi = trim($row['deskripsi_fase'] ?? '');
                $elemenNama = trim($row['elemen_pembelajaran'] ?? '');
                $elemenUrutan = $row['urutan_elemen'] ?? null;
                $cpElemenDeskripsi = trim($row['cp_elemen'] ?? '');
                $tpKode = trim($row['kode_tp'] ?? '');
                $tpDeskripsi = trim($row['deskripsi_tp'] ?? '');
                $tpUrutan = $row['urutan_tp'] ?? null;
                $tingkat = $row['tingkat'] ?? null;
                $semesterNama = trim($row['semester'] ?? '');

                // 1. Handle Mata Pelajaran
                if (!empty($mataPelajaranName)) {
                    $currentMataPelajaran = MataPelajaran::where('name', $mataPelajaranName)->first();
                    if (!$currentMataPelajaran) {
                        $this->results['errors'][] = "Baris {$rowNumber}: Mata pelajaran '{$mataPelajaranName}' tidak ditemukan";
                        continue;
                    }
                }

                if (!$currentMataPelajaran) {
                    $this->results['errors'][] = "Baris {$rowNumber}: Mata pelajaran harus diisi terlebih dahulu";
                    continue;
                }

                // 2. Handle CP Fase
                if (!empty($fase)) {
                    if (empty($faseDeskripsi)) {
                        $this->results['warnings'][] = "Baris {$rowNumber}: Fase '{$fase}' tidak memiliki deskripsi";
                    }
                    
                    $currentCpFase = CpFase::updateOrCreate(
                        [
                            'mata_pelajaran_id' => $currentMataPelajaran->id,
                            'fase' => $fase
                        ],
                        [
                            'deskripsi' => $faseDeskripsi ?: "Deskripsi Fase {$fase}"
                        ]
                    );
                }

                if (!$currentCpFase) {
                    $this->results['errors'][] = "Baris {$rowNumber}: Fase harus diisi terlebih dahulu";
                    continue;
                }

                // 3. Handle Elemen Pembelajaran
                if (!empty($elemenNama)) {
                    $currentElemenPembelajaran = ElemenPembelajaran::updateOrCreate(
                        [
                            'cp_fase_id' => $currentCpFase->id,
                            'nama' => $elemenNama
                        ],
                        [
                            'urutan' => $elemenUrutan ?: 1
                        ]
                    );

                    // 4. Handle CP Elemen
                    if (!empty($cpElemenDeskripsi)) {
                        $currentCpElemen = CpElemen::updateOrCreate(
                            [
                                'elemen_pembelajaran_id' => $currentElemenPembelajaran->id
                            ],
                            [
                                'deskripsi' => $cpElemenDeskripsi
                            ]
                        );
                    }
                }

                if (!$currentElemenPembelajaran) {
                    $this->results['errors'][] = "Baris {$rowNumber}: Elemen Pembelajaran harus diisi terlebih dahulu";
                    continue;
                }

                if (!$currentCpElemen) {
                    $this->results['errors'][] = "Baris {$rowNumber}: CP Elemen harus diisi terlebih dahulu";
                    continue;
                }

                // 5. Handle Tujuan Pembelajaran
                if (!empty($tpKode) && !empty($tpDeskripsi)) {
                    $tujuanPembelajaran = TujuanPembelajaran::updateOrCreate(
                        [
                            'cp_elemen_id' => $currentCpElemen->id,
                            'kode' => $tpKode
                        ],
                        [
                            'deskripsi' => $tpDeskripsi,
                            'urutan' => $tpUrutan ?: 1
                        ]
                    );

                    // 6. Handle TP Pemetaan
                    if (!empty($tingkat) && !empty($semesterNama)) {
                        $semester = $semesters->where('tipe', $semesterNama)->first();
                        
                        if (!$semester) {
                            $this->results['errors'][] = "Baris {$rowNumber}: Semester '{$semesterNama}' tidak ditemukan";
                            continue;
                        }

                        if (!is_numeric($tingkat) || $tingkat < 1 || $tingkat > 6) {
                            $this->results['errors'][] = "Baris {$rowNumber}: Tingkat harus berupa angka 1-6";
                            continue;
                        }

                        TPPemetaan::updateOrCreate(
                            [
                                'tujuan_pembelajaran_id' => $tujuanPembelajaran->id,
                                'tingkat' => $tingkat,
                                'semester_id' => $semester->id
                            ]
                        );

                        $this->results['success']++;
                    }
                } elseif (!empty($tpKode) || !empty($tpDeskripsi)) {
                    $this->results['warnings'][] = "Baris {$rowNumber}: Kode TP dan Deskripsi TP harus diisi keduanya";
                }

            } catch (\Exception $e) {
                $this->results['errors'][] = "Baris {$rowNumber}: {$e->getMessage()}";
            }
        }
    }

    /**
     * Check if row is empty
     */
    protected function isRowEmpty($row): bool
    {
        // Cek kolom penting
        $importantFields = ['mata_pelajaran', 'fase', 'elemen_pembelajaran', 'kode_tp'];
        
        foreach ($importantFields as $field) {
            if (!empty($row[$field])) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Get import results
     */
    public function getResults(): array
    {
        return $this->results;
    }
}
