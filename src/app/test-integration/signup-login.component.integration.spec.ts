// integration.spec.ts
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { AuthService } from '../services/auth/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

class MockAuthService {
  register(user: any) {
    return of(true);
  }
  signup(user: any) {
    return of(true);
  }

  getRoleUser(){
    return 'mocked-role';
  }

  login(email: string, password: string) {
    return of(true);  // Simuler une réponse réussie
  }

  isLoggedIn() {
    return of(true);  // ou toute autre valeur que vous voulez retourner
  }
}


describe('Integration Test: Signup and Login', () => {
  let router: Router;
  let location: Location;
  let authService: AuthService;

  beforeEach(async(() => { // On englobe en ensemble de tests relatifs à une fonctionnalité ou un component, ici Signup et Login
    TestBed.configureTestingModule({ // Méthode qui permet de configure notre test dans notre environnement de test
      imports: [LoginComponent, SignupComponent, RouterTestingModule.withRoutes([
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent },
        { path: '**', redirectTo: '/login', pathMatch: 'full' } // On déclare les mêmes paths que le auth service pour que le test s'effectue
      ]), ReactiveFormsModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }] // On fournit les services qui seront testés et injectés. Ici on Mock AuthService pour l'isoler et le tester sans les comportements des services extérieurs qui lui sont associés
    }).compileComponents();

    router = TestBed.inject(Router); //TestBed agit comme une zone de préparation ou on met tout en place pour exécuter le test
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
  }));

  it('should sign up and then log in', async(() => { // it(), soit un test individuel qui sera effectué
    // Navigate to signup
    router.navigate(['signup']).then(() => {
      // Création d'une fixture qui va encapsuler la création de la copie du component Signup et on la stocke dans signupFixture
      const signupFixture = TestBed.createComponent(SignupComponent);
      // On accède ensuite à cette instance via la fixture précédemment créée via la prorpiété componentInstance
      const signupComponent = signupFixture.componentInstance;
      // On peut paramètres les valeurs du formulaire de contact.
      signupComponent.loginForm.setValue({
        lastname: 'Doe',
        firstname: 'John',
        phone: '1234567890',
        email: 'john.doe@example.com',
        password: 'Password-123',
        confirmPassword: 'Password-123',
        birthDate: '2002-01-01',
        address: '2 Allée Lorentz Champs-sur-Marne',
        role: 'customer',
        newsletter: '0'
      });
      // On envoi le formulaire
      signupComponent.onSubmit();
      // On détecte les changements effectuer pour l'appliquer
      signupFixture.detectChanges();

      // On se dirige vers /login
      return router.navigate(['login']);
    }).then(() => {
      const loginFixture = TestBed.createComponent(LoginComponent);
      const loginComponent = loginFixture.componentInstance;
      loginComponent.loginForm.setValue({
        email: 'john.doe@example.com',
        password: 'Password-123'
      });
      loginComponent.onSubmit();
      loginFixture.detectChanges();


    });
  }));
});
