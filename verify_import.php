<?php

use App\Models\TujuanPembelajaran;
use App\Models\TPPemetaan;
use App\Models\CpElemen;
use App\Models\ElemenPembelajaran;

echo "=== VERIFIKASI DATA IMPORT ===" . PHP_EOL . PHP_EOL;

$tpCount = TujuanPembelajaran::count();
$pemetaanCount = TPPemetaan::count();
$cpElemenCount = CpElemen::count();
$elemenCount = ElemenPembelajaran::count();

echo "📊 Statistik:" . PHP_EOL;
echo "   • Elemen Pembelajaran: {$elemenCount}" . PHP_EOL;
echo "   • CP Elemen: {$cpElemenCount}" . PHP_EOL;
echo "   • Tujuan Pembelajaran: {$tpCount}" . PHP_EOL;
echo "   • TP Pemetaan: {$pemetaanCount}" . PHP_EOL;
echo PHP_EOL;

if ($tpCount > 0) {
    echo "📝 Detail Tujuan Pembelajaran:" . PHP_EOL;
    $tps = TujuanPembelajaran::with(['cpElemen.elemenPembelajaran.cpFase.mataPelajaran', 'tpPemetaans.semester'])
        ->orderBy('kode')
        ->get();
    
    foreach ($tps as $tp) {
        $mapel = $tp->cpElemen->elemenPembelajaran->cpFase->mataPelajaran->name ?? 'N/A';
        $fase = $tp->cpElemen->elemenPembelajaran->cpFase->fase ?? 'N/A';
        $elemen = $tp->cpElemen->elemenPembelajaran->nama ?? 'N/A';
        $pemetaanCount = $tp->tpPemetaans->count();
        
        echo "   • {$tp->kode} ({$mapel} - Fase {$fase})" . PHP_EOL;
        echo "     └─ {$tp->deskripsi}" . PHP_EOL;
        echo "     └─ Elemen: {$elemen}" . PHP_EOL;
        echo "     └─ Pemetaan: {$pemetaanCount} tingkat/semester" . PHP_EOL;
        
        if ($pemetaanCount > 0) {
            foreach ($tp->tpPemetaans as $pemetaan) {
                $semester = $pemetaan->semester->tipe ?? 'N/A';
                echo "        • Tingkat {$pemetaan->tingkat}, Semester {$semester}" . PHP_EOL;
            }
        }
        echo PHP_EOL;
    }
}

echo "✅ Verifikasi selesai!" . PHP_EOL;
