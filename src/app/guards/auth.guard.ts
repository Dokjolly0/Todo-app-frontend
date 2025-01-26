import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  if (authSrv.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
