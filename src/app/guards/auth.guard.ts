import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const auth = inject(AuthService);
  const isLoggedIn = auth.isLoggedIn();
  if (!isLoggedIn) {
    router.navigate(['auth/login']);
    return false;
  }
  return auth.isLoggedIn();
};
