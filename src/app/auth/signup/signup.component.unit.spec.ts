import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from 'src/app/pages/home/home.component';

class MockAuthService {
  register(user: any) {
    return of(true);
  }
  signup(user: any) {
    return of(true);
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [SignupComponent, RouterTestingModule.withRoutes([{ path: 'home', component: HomeComponent }]), ReactiveFormsModule],
      providers: [{provide: AuthService, useClass: MockAuthService}]
    }).compileComponents();
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(SignupComponent);
      component = fixture.componentInstance;
      authService = TestBed.inject(AuthService);
      spyOn(component, 'isFieldInvalid').and.callFake(() => false);  // Toujours retourner false
      fixture.detectChanges();
      
  });

  it('should register with valid form data', () => {
    // Définir les valeurs du formulaire
    component.loginForm.setValue({
      lastname: 'Doe',
      firstname: 'John',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123'
    });
    // Espionner la méthode 'signup' du service d'authentification
    spyOn(authService, 'signup').and.callThrough();

    // Simuler la soumission du formulaire
    component.onSubmit();
    // Vérifier que la méthode 'signup' a été appelée avec les bonnes valeurs
    expect(authService.signup).toHaveBeenCalledWith({
      firstname: 'John',
      lastname: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123'
    });
  });
});
