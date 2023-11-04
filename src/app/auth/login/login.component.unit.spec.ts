import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';  // Importer la fonction 'of' de rxjs

class MockAuthService {  // Créer une classe mock pour le service d'authentification
  login(email: string, password: string) {
    return of(true);  // Simuler une réponse réussie
  }

  isLoggedIn() {
    return of(true);  // ou toute autre valeur que vous voulez retourner
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;  // Ajouter une variable pour le service d'authentification

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }]  // Utiliser le mock service
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);  // Injecter le service d'authentification
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login with correct credentials', () => {
    component.loginForm.setValue({ email: 'fidele.antipas@gmail.com', password: 'password' });  // Simuler la saisie de l'utilisateur
    spyOn(authService, 'login').and.callThrough();  // Espionner la méthode 'login' du service d'authentification
    component.onSubmit();  // Appeler la méthode de connexion du composant
    expect(authService.login).toHaveBeenCalledWith({ email: 'fidele.antipas@gmail.com', password: 'password' });  // Vérifier que la méthode 'login' du service a été appelée avec les bonnes valeurs // Vérifier que la méthode 'login' du service a été appelée avec les bonnes valeurs
  });
});
