<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case GURU = 'guru';

    /**
     * Get all role values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get role label for display
     */
    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::GURU => 'Guru',
        };
    }

    /**
     * Check if role is admin
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role is guru
     */
    public function isGuru(): bool
    {
        return $this === self::GURU;
    }
}
