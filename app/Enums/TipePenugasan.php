<?php

namespace App\Enums;

enum TipePenugasan: string
{
    case BIDANG_STUDI = 'bidang_studi';
    case WALI_KELAS = 'wali_kelas';

    public function label(): string
    {
        return match($this) {
            self::BIDANG_STUDI => 'Guru Bidang Studi',
            self::WALI_KELAS => 'Wali Kelas',
        };
    }
}
