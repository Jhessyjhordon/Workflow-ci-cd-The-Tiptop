import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: authGuard;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [authGuard]
    });
    guard = TestBed.inject(authGuard);
    // Initialisez route et state si nécessaire
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true for canActivate', () => {
    // Supposons que votre canActivate retourne un booléen pour ce test
    let result: boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>;
    result = guard.canActivate();
    // Vous devriez adapter cette partie en fonction de la logique de votre garde.
    // Si c'est un Observable ou une Promise, vous devez vous abonner ou résoudre la promesse.
    expect(result).toBe(true);
  });
});
