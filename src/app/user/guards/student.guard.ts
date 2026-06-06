// src/app/guards/student.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check if token exists in localStorage
  const token = localStorage.getItem('hd_token');

  if (token) {
    return true;  // allow access
  }

  // No token — go to login
  router.navigate(['/login']);
  return false;
};