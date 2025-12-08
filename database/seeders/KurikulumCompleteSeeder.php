<?php

namespace Database\Seeders;

use App\Models\MataPelajaran;
use App\Models\CpFase;
use App\Models\ElemenPembelajaran;
use App\Models\CpElemen;
use App\Models\TujuanPembelajaran;
use App\Models\TPPemetaan;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class KurikulumCompleteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * INSTRUKSI PENGGUNAAN:
     * =====================
     * 1. Cari section "DATA MATA PELAJARAN" untuk mengubah data mata pelajaran
     * 2. Setiap mata pelajaran memiliki struktur:
     *    - CP Fase (fase A, B, C, dll)
     *    - Elemen Pembelajaran (komponen utama)
     *    - CP Elemen (deskripsi capaian)
     *    - Tujuan Pembelajaran (dengan kode TP)
     *    - TP Pemetaan (tingkat & semester)
     * 
     * 3. Ganti PLACEHOLDER berikut:
     *    - [GANTI: Deskripsi Fase]
     *    - [GANTI: Nama Elemen]
     *    - [GANTI: Deskripsi CP Elemen]
     *    - [GANTI: Kode TP] (contoh: TP.1.1, TP.1.2)
     *    - [GANTI: Deskripsi Tujuan Pembelajaran]
     *    - tingkat (1-6)
     *    - semester_id (ambil dari database)
     */
    public function run(): void
    {
        // ============================================================
        // SECTION: DATA MATA PELAJARAN
        // ============================================================
        // Ambil semua mata pelajaran yang sudah ada
        $mataPelajarans = $this->getMataPelajaranData();

        // Ambil data semester untuk pemetaan
        $semesters = Semester::all();
        
        foreach ($mataPelajarans as $mapelData) {
            $this->seedMataPelajaran($mapelData, $semesters);
        }
    }

    /**
     * Definisi data mata pelajaran dengan struktur lengkap
     * 
     * INSTRUKSI: Edit bagian ini untuk mengubah data kurikulum
     */
    private function getMataPelajaranData(): array
    {
        return [
            // ========================================
            // MATA PELAJARAN: Life Skills
            // ========================================
            [
                'name' => 'Life Skills',
                'cp_fases' => [
                    [
                        'fase' => 'A', // [GANTI: Fase A, B, C, D, E, atau F]
                        'deskripsi' => 'Peserta didik mampu menjaga kebersihan dan kerapian diri, benda pribadi, dan lingkungan sekitar melalui kegiatan perawatan mandiri yang sederhana. Peserta didik dapat menyiapkan makanan ringan yang tidak menggunakan api, mengenali informasi pribadi penting untuk keselamatan, serta menunjukkan keterampilan awal dalam menjahit dan menggunakan media digital sederhana. Peserta didik menunjukkan kebiasaan hidup bersih, teratur, hati-hati, dan bertanggung jawab dalam melakukan aktivitas keseharian dengan pendampingan ringan dari orang dewasa.',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => 'Kebersihan dan Kerapian',
                                'urutan' => 1,
                                'cp_elemen' => 'Peserta didik mampu menjaga kebersihan dan kerapian diri, benda pribadi, dan lingkungan sekitar melalui serangkaian kegiatan perawatan mandiri yang sederhana, dilakukan secara rutin, dan dengan pendampingan ringan dari orang dewasa. Peserta didik menunjukkan kebiasaan hidup bersih dan teratur, serta mampu merapikan dan membersihkan barang atau area yang telah digunakan.',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => 'LSK-A-1-1',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-2',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 2,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-3',
                                        'deskripsi' => 'Peserta didik mampu mandi secara mandiri menggunakan sabun dan air bersih untuk menjaga kebersihan tubuh.',
                                        'urutan' => 3,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-4',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 4,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-5',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 5,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-6',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 6,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-7',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 7,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-8',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 8,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-9',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 9,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-10',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 10,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                                                    [
                                        'kode' => 'LSK-A-1-11',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 11,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-12',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 12,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-13',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 13,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-14',
                                        'deskripsi' => 'Peserta didik mampu menggosok gigi secara mandiri dengan langkah yang benar untuk menjaga kesehatan mulut dan gigi.',
                                        'urutan' => 14,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                    [
                                        'kode' => 'LSK-A-1-15',
                                        'deskripsi' => 'Peserta didik mampu mencuci tangan dengan sabun menggunakan langkah yang benar pada waktu yang sesuai untuk menjaga kebersihan diri.',
                                        'urutan' => 15,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'], // [GANTI: tingkat 1-6]
                                        ]
                                    ],
                                ]
                            ],
                            [
                                'nama' => '[GANTI: Nama Elemen Pembelajaran 2]',
                                'urutan' => 2,
                                'cp_elemen' => '[GANTI: Deskripsi CP Elemen untuk elemen pembelajaran 2]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.2.1]',
                                        'deskripsi' => '[GANTI: Deskripsi tujuan pembelajaran 2.1]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                            ['tingkat' => 2, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                    [
                        'fase' => 'B', // Fase B untuk kelas 3-4
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran untuk Fase B mata pelajaran Life Skills]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Nama Elemen Pembelajaran Fase B]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP Elemen Fase B]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.B.1]',
                                        'deskripsi' => '[GANTI: Deskripsi tujuan pembelajaran Fase B]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 3, 'semester_nama' => 'Ganjil'],
                                            ['tingkat' => 3, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Bahasa Indonesia
            // ========================================
            [
                'name' => 'Bahasa Indonesia',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Bahasa Indonesia Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Menyimak dan Berbicara]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Menyimak dan Berbicara]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.BI.1.1]',
                                        'deskripsi' => '[GANTI: Siswa mampu menyimak instruksi sederhana]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                            [
                                'nama' => '[GANTI: Membaca dan Menulis]',
                                'urutan' => 2,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Membaca dan Menulis]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.BI.2.1]',
                                        'deskripsi' => '[GANTI: Siswa mampu membaca kata sederhana]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Music
            // ========================================
            [
                'name' => 'Music',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Music Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Apresiasi Musik]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Apresiasi Musik]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.MUS.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal berbagai alat musik]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Sport
            // ========================================
            [
                'name' => 'Sport',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Sport Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Aktivitas Jasmani]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Aktivitas Jasmani]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.SPT.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat melakukan gerakan dasar]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Citizenship
            // ========================================
            [
                'name' => 'Citizenship',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Citizenship Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Pancasila dan UUD]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Pancasila dan UUD]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.CTZ.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal simbol Pancasila]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Materi Keputrian Keputraan
            // ========================================
            [
                'name' => 'Materi Keputrian Keputraan',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Materi Keputrian Keputraan Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Pengembangan Karakter]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Pengembangan Karakter]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.MKK.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal nilai-nilai karakter]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Religion
            // ========================================
            [
                'name' => 'Religion',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Religion Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Akidah dan Akhlak]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Akidah dan Akhlak]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.REL.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal rukun iman]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                            [
                                'nama' => '[GANTI: Ibadah]',
                                'urutan' => 2,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Ibadah]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.REL.2.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal tata cara wudhu]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: MATH
            // ========================================
            [
                'name' => 'MATH',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran MATH Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Bilangan]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Bilangan]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.MAT.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal bilangan 1-10]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                    [
                                        'kode' => '[GANTI: TP.MAT.1.2]',
                                        'deskripsi' => '[GANTI: Siswa dapat menghitung penjumlahan sederhana]',
                                        'urutan' => 2,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                            [
                                'nama' => '[GANTI: Geometri]',
                                'urutan' => 2,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Geometri]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.MAT.2.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal bentuk bangun datar]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                            [
                                'nama' => '[GANTI: Pengukuran]',
                                'urutan' => 3,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Pengukuran]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.MAT.3.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat membandingkan panjang benda]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: IPAS
            // ========================================
            [
                'name' => 'IPAS',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran IPAS Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Makhluk Hidup]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Makhluk Hidup]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.IPA.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal bagian tubuh manusia]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                            [
                                'nama' => '[GANTI: Benda dan Sifatnya]',
                                'urutan' => 2,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Benda dan Sifatnya]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.IPA.2.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal sifat benda]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Budaya Jabar
            // ========================================
            [
                'name' => 'Budaya Jabar',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Budaya Jabar Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Kesenian Sunda]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Kesenian Sunda]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.BJ.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat mengenal alat musik tradisional Sunda]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // MATA PELAJARAN: Literasi
            // ========================================
            [
                'name' => 'Literasi',
                'cp_fases' => [
                    [
                        'fase' => 'A',
                        'deskripsi' => '[GANTI: Deskripsi capaian pembelajaran Literasi Fase A]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[GANTI: Pemahaman Bacaan]',
                                'urutan' => 1,
                                'cp_elemen' => '[GANTI: Deskripsi CP untuk Pemahaman Bacaan]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[GANTI: TP.LIT.1.1]',
                                        'deskripsi' => '[GANTI: Siswa dapat memahami cerita sederhana]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                            ['tingkat' => 1, 'semester_nama' => 'Genap'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],

            // ========================================
            // TAMBAHKAN MATA PELAJARAN BARU DI SINI
            // ========================================
            // Contoh struktur untuk mata pelajaran baru:
            /*
            [
                'name' => '[NAMA MATA PELAJARAN]',
                'cp_fases' => [
                    [
                        'fase' => '[A/B/C/D/E/F]',
                        'deskripsi' => '[DESKRIPSI FASE]',
                        'elemen_pembelajarans' => [
                            [
                                'nama' => '[NAMA ELEMEN]',
                                'urutan' => 1,
                                'cp_elemen' => '[DESKRIPSI CP ELEMEN]',
                                'tujuan_pembelajarans' => [
                                    [
                                        'kode' => '[KODE TP]',
                                        'deskripsi' => '[DESKRIPSI TP]',
                                        'urutan' => 1,
                                        'pemetaans' => [
                                            ['tingkat' => 1, 'semester_nama' => 'Ganjil'],
                                        ]
                                    ],
                                ]
                            ],
                        ]
                    ],
                ]
            ],
            */
        ];
    }

    /**
     * Proses seeding untuk satu mata pelajaran
     */
    private function seedMataPelajaran(array $mapelData, $semesters): void
    {
        // Cari atau buat mata pelajaran
        $mataPelajaran = MataPelajaran::where('name', $mapelData['name'])->first();
        
        if (!$mataPelajaran) {
            echo "⚠️  Mata pelajaran '{$mapelData['name']}' tidak ditemukan. Skip.\n";
            return;
        }

        echo "📚 Seeding: {$mapelData['name']}\n";

        // Loop CP Fase
        foreach ($mapelData['cp_fases'] as $faseData) {
            $cpFase = CpFase::updateOrCreate(
                [
                    'mata_pelajaran_id' => $mataPelajaran->id,
                    'fase' => $faseData['fase']
                ],
                [
                    'deskripsi' => $faseData['deskripsi']
                ]
            );

            echo "  └─ Fase {$faseData['fase']}\n";

            // Loop Elemen Pembelajaran
            foreach ($faseData['elemen_pembelajarans'] as $elemenData) {
                $elemenPembelajaran = ElemenPembelajaran::updateOrCreate(
                    [
                        'cp_fase_id' => $cpFase->id,
                        'nama' => $elemenData['nama']
                    ],
                    [
                        'urutan' => $elemenData['urutan']
                    ]
                );

                echo "     └─ Elemen: {$elemenData['nama']}\n";

                // Buat CP Elemen
                $cpElemen = CpElemen::updateOrCreate(
                    [
                        'elemen_pembelajaran_id' => $elemenPembelajaran->id
                    ],
                    [
                        'deskripsi' => $elemenData['cp_elemen']
                    ]
                );

                // Loop Tujuan Pembelajaran
                foreach ($elemenData['tujuan_pembelajarans'] as $tpData) {
                    $tujuanPembelajaran = TujuanPembelajaran::updateOrCreate(
                        [
                            'cp_elemen_id' => $cpElemen->id,
                            'kode' => $tpData['kode']
                        ],
                        [
                            'deskripsi' => $tpData['deskripsi'],
                            'urutan' => $tpData['urutan']
                        ]
                    );

                    echo "        └─ TP: {$tpData['kode']}\n";

                    // Loop TP Pemetaan
                    foreach ($tpData['pemetaans'] as $pemetaanData) {
                        $semester = $semesters->where('nama', $pemetaanData['semester_nama'])->first();
                        
                        if ($semester) {
                            TPPemetaan::updateOrCreate(
                                [
                                    'tujuan_pembelajaran_id' => $tujuanPembelajaran->id,
                                    'tingkat' => $pemetaanData['tingkat'],
                                    'semester_id' => $semester->id
                                ]
                            );
                        }
                    }
                }
            }
        }

        echo "\n";
    }
}
