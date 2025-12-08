<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\KurikulumTemplateExport;
use App\Models\MataPelajaran;

class GenerateKurikulumTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kurikulum:template {--output= : Nama file output (default: template_kurikulum.xlsx)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate template Excel untuk import data kurikulum';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = $this->option('output') ?: 'template_kurikulum.xlsx';
        
        // Simpan di root storage/app (bukan private/)
        $diskPath = $filename;
        $fullPath = storage_path('app/' . $filename);

        $this->info("📝 Membuat template Excel...");
        $this->newLine();

        try {
            // Export template ke public disk agar lebih mudah diakses
            $result = Excel::store(new KurikulumTemplateExport(), $diskPath, 'public');
            
            // Update full path sesuai dengan disk public
            $fullPath = storage_path('app/public/' . $filename);

            $this->info("✅ Template berhasil dibuat!");
            $this->newLine();
            $this->line("📂 Lokasi file: <fg=green>{$fullPath}</>");
            $this->newLine();
            
            // Tampilkan info mata pelajaran yang tersedia
            $this->info("📚 Mata Pelajaran yang Tersedia:");
            $mataPelajarans = MataPelajaran::orderBy('name')->get();
            foreach ($mataPelajarans as $mapel) {
                $this->line("   • {$mapel->name}");
            }
            
            $this->newLine();
            $this->info("📖 Panduan Pengisian:");
            $this->line("   1. Buka file Excel yang sudah dibuat");
            $this->line("   2. Lihat contoh data di baris 2-6 (background abu-abu)");
            $this->line("   3. Isi data Anda mulai baris 7 ke bawah");
            $this->line("   4. Kolom yang bisa dikosongkan jika sama dengan baris sebelumnya:");
            $this->line("      • mata_pelajaran");
            $this->line("      • fase");
            $this->line("      • deskripsi_fase");
            $this->line("      • elemen_pembelajaran");
            $this->line("      • urutan_elemen");
            $this->line("      • cp_elemen");
            $this->line("   5. Kolom yang HARUS diisi:");
            $this->line("      • kode_tp (contoh: TP.MAT.1.1)");
            $this->line("      • deskripsi_tp");
            $this->line("      • urutan_tp (1, 2, 3, ...)");
            $this->line("      • tingkat (1-6)");
            $this->line("      • semester (Ganjil/Genap)");
            
            $this->newLine();
            $this->info("🚀 Cara Import:");
            $this->line("   php artisan kurikulum:import public/{$filename}");
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error("❌ Gagal membuat template: " . $e->getMessage());
            return 1;
        }
    }
}
