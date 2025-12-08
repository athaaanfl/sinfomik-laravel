<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('UserRole Enum', function () {
    it('can create user with enum role', function () {
        $admin = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::ADMIN,
        ]);

        expect($admin->role)->toBeInstanceOf(UserRole::class);
        expect($admin->role)->toBe(UserRole::ADMIN);
        expect($admin->role->value)->toBe('admin');
    });

    it('can create user with string role and cast to enum', function () {
        $guru = User::create([
            'name' => 'Guru Test',
            'email' => 'guru@test.com',
            'password' => bcrypt('password'),
            'role' => 'guru',
        ]);

        expect($guru->role)->toBeInstanceOf(UserRole::class);
        expect($guru->role)->toBe(UserRole::GURU);
        expect($guru->role->value)->toBe('guru');
    });

    it('has isAdmin helper method', function () {
        $admin = User::factory()->admin()->create();
        $guru = User::factory()->guru()->create();

        expect($admin->isAdmin())->toBeTrue();
        expect($admin->isGuru())->toBeFalse();
        expect($guru->isAdmin())->toBeFalse();
        expect($guru->isGuru())->toBeTrue();
    });

    it('can use factory states', function () {
        $admin = User::factory()->admin()->create();
        $guru = User::factory()->guru()->create();

        expect($admin->role)->toBe(UserRole::ADMIN);
        expect($guru->role)->toBe(UserRole::GURU);
    });

    it('has label method', function () {
        expect(UserRole::ADMIN->label())->toBe('Administrator');
        expect(UserRole::GURU->label())->toBe('Guru');
    });

    it('has values static method', function () {
        $values = UserRole::values();

        expect($values)->toBeArray();
        expect($values)->toContain('admin', 'guru');
        expect($values)->toHaveCount(2);
    });

    it('can query users by role', function () {
        User::factory()->admin()->count(3)->create();
        User::factory()->guru()->count(5)->create();

        $admins = User::where('role', UserRole::ADMIN)->get();
        $gurus = User::where('role', UserRole::GURU)->get();

        expect($admins)->toHaveCount(3);
        expect($gurus)->toHaveCount(5);
    });

    it('preserves role in database as string', function () {
        $user = User::factory()->admin()->create();
        
        // Check database value is still string
        $rawUser = \DB::table('users')->where('id', $user->id)->first();
        
        expect($rawUser->role)->toBe('admin');
        expect($rawUser->role)->toBeString();
    });
});
