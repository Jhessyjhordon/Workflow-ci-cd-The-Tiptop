import { TestBed, async, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';

class MockAuthService {
  signup(user: any) {
    return of(true);
  }

  getRoleUser(){
    return 'mocked-role';
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [SignupComponent, RouterTestingModule.withRoutes([{ path: 'auth/login', component: LoginComponent }]), ReactiveFormsModule],
      providers: [{provide: AuthService, useClass: MockAuthService}]
    }).compileComponents();
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(SignupComponent);
      component = fixture.componentInstance;
      authService = TestBed.inject(AuthService);
      // spyOn(component, 'isFieldInvalid').and.callFake(() => false);  // Toujours retourner false
      fixture.detectChanges();
      
  });

  it('should register with valid form data', fakeAsync(() => {
    // Définir les valeurs du formulaire
    component.loginForm.setValue({
      lastname: 'Doe',
      firstname: 'John',
      phone: '1234567890',
      email: 'john.doe@example.com',
      address: '2 Allée Lorentz Champs-sur-Marne',
      birthDate: '2000-01-01',
      password: 'Password-123',
      confirmPassword: 'Password-123',
      role: 'customer',
      newsletter: '0'
    });

    fixture.detectChanges(); // Mise à jour de l'état du composant
    tick(); // Simule le passage du temps
    console.log('Validité du formulaire:', component.loginForm.valid); // Vérifier la validité du formulaire
    // Espionner la méthode 'signup' du service d'authentification
    spyOn(authService, 'signup').and.callThrough();

    // Simuler la soumission du formulaire
    console.log('Calling onSubmit');
    component.onSubmit();

    tick(component.toastDisplayDuration); // Avancer le temps pour la durée du toast

    // Vérifier que la méthode 'signup' a été appelée avec les bonnes valeurs
    expect(authService.signup).toHaveBeenCalledWith({
      lastname: 'Doe',
      firstname: 'John',
      phone: '1234567890',
      email: 'john.doe@example.com',
      address: '2 Allée Lorentz Champs-sur-Marne',
      birthDate: '2000-01-01',
      password: 'Password-123',
      confirmPassword: 'Password-123',
      role: 'customer',
      newsletter: '0'
    });

    flush(); // Epuise la file d'attente des timers en cours
  }));
});
