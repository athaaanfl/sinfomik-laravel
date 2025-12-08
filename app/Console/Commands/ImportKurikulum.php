<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\KurikulumImport;
use Illuminate\Support\Facades\Storage;

class ImportKurikulum extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kurikulum:import {file : Path ke file Excel (relatif dari storage/app atau absolute path)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data kurikulum dari file Excel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');
        
        // Cek apakah file ada
        if (!file_exists($filePath)) {
            // Coba cari di storage/app
            $storagePath = storage_path('app/' . $filePath);
            if (file_exists($storagePath)) {
                $filePath = $storagePath;
            } else {
                $this->error("❌ File tidak ditemukan: {$filePath}");
                $this->info("💡 Tip: Letakkan file di storage/app/ atau berikan absolute path");
                return 1;
            }
        }

        $this->info("📂 Membaca file: {$filePath}");
        $this->newLine();

        try {
            $import = new KurikulumImport();
            
            $this->info("⏳ Memproses import...");
            $progressBar = $this->output->createProgressBar();
            $progressBar->start();
            
            Excel::import($import, $filePath);
            
            $progressBar->finish();
            $this->newLine(2);

            // Tampilkan hasil
            $results = $import->getResults();
            
            $this->info("✅ Import selesai!");
            $this->newLine();
            
            $this->line("📊 <fg=green>Ringkasan:</>");
            $this->line("   • Berhasil: <fg=green>{$results['success']}</> baris");
            $this->line("   • Error: <fg=red>" . count($results['errors']) . "</> baris");
            $this->line("   • Warning: <fg=yellow>" . count($results['warnings']) . "</> baris");
            
            // Tampilkan errors
            if (!empty($results['errors'])) {
                $this->newLine();
                $this->error("❌ ERRORS:");
                foreach ($results['errors'] as $error) {
                    $this->line("   • {$error}");
                }
            }
            
            // Tampilkan warnings
            if (!empty($results['warnings'])) {
                $this->newLine();
                $this->warn("⚠️  WARNINGS:");
                foreach ($results['warnings'] as $warning) {
                    $this->line("   • {$warning}");
                }
            }
            
            $this->newLine();
            
            if (count($results['errors']) === 0) {
                $this->info("🎉 Semua data berhasil diimport!");
                return 0;
            } else {
                $this->warn("⚠️  Import selesai dengan beberapa error. Silakan cek pesan error di atas.");
                return 1;
            }
            
        } catch (\Exception $e) {
            $this->error("❌ Terjadi kesalahan: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }
}
