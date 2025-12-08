<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Support both enum and string comparison
        $userRole = $request->user()->role;
        $userRoleValue = $userRole instanceof UserRole ? $userRole->value : $userRole;
        
        if (!in_array($userRoleValue, $roles)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
