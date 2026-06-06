import { CanActivateFn } from '@angular/router';

export const studentGuard: CanActivateFn = (route, state) => {
  // In a real app, check auth token here
  // For demo purposes, always allow access
  return true;
};
