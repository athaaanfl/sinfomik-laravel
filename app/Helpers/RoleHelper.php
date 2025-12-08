<?php

namespace App\Helpers;

use App\Enums\UserRole;

class RoleHelper
{
    /**
     * Get all available roles
     * 
     * @return array
     */
    public static function all(): array
    {
        return UserRole::cases();
    }

    /**
     * Get all role values
     * 
     * @return array
     */
    public static function values(): array
    {
        return UserRole::values();
    }

    /**
     * Get role options for forms
     * 
     * @return array
     */
    public static function options(): array
    {
        return array_map(fn($role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ], UserRole::cases());
    }

    /**
     * Check if a value is a valid role
     * 
     * @param string $value
     * @return bool
     */
    public static function isValid(string $value): bool
    {
        return in_array($value, UserRole::values());
    }

    /**
     * Get UserRole enum from string
     * 
     * @param string $value
     * @return UserRole|null
     */
    public static function from(string $value): ?UserRole
    {
        return UserRole::tryFrom($value);
    }
}
