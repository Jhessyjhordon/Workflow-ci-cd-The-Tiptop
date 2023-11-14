import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { UserCustomer } from 'src/app/models/user-custumer.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /* Ce service est utilisé par plein de component. Et dans le service on a des methode qui permet d'accéder aux données des user
    or certains component accède au service avant que celui récupère les donnée. Il faut donc s'assurer que les données soient disponible
    avant qu'ils sont utilisé dans les component qui accède au service. C'est donc pour cela qu'on utilise  "BehaviorSubject" et un "Observable" 
  */
  // BehaviorSubject  sert a stocker les données du user 
  private userDataSubject: BehaviorSubject<UserCustomer | null> = new BehaviorSubject<UserCustomer | null>(null);
  // userData$ est un Observable qu'on peut écouter pour obtenir les données de l'utilisateur.
  userData$: Observable<UserCustomer | null> = this.userDataSubject.asObservable();

  // private userData!: UserCustomer;
  private endpointUrl = 'http://api.dev.dsp-archiwebo22b-ji-rw-ah.fr/user'; // Endpoint de l'API 

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<UserCustomer> {
    const url = `${this.endpointUrl}/${id}`; // Utilisez l'ID fourni pour construire l'URL.
    // console.log(url);

    return this.http.get<{ user: UserCustomer }>(url).pipe(
      // tap(response => console.log('Réponse brute de l\'API :', response)), // sert a verifié le renvoie de l'API avant de mapper les données et donc voir la structure de la reponse brute
      map(response => response.user),
      catchError(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données de l\'utilisateur:', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer l'ID de l'utilisateur à partir du token.
  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token'); // Récupérez le token depuis le localStorage.
    if (token) {
      try {
        const tokenDecoded: any = jwtDecode(token); // Décoder le token.
        const userId = parseInt(tokenDecoded.id, 10); // Assurez-vous que l'ID est un nombre.
        if (!isNaN(userId)) { // vérifie que l'ID est bien un nombre avant de le retourner.
          return userId;
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    }
    return null; // Si le token n'est pas disponible ou que l'ID n'a pas pu être extrait.
  }

  // Méthode pour récupérer les informations complètes de l'utilisateur
  // getUserData(): UserCustomer {
  //   return this.userData;
  // }

  // Méthode pour mettre à jour les informations de l'utilisateur
  setUserData(userData: UserCustomer): void {
    // transformation de l'objet pour récupérer uniquement les propriétés que j'ai définies dans le modèle UserCustomer
    // const filteredUserData: UserCustomer = {
    //   id: userData.id,
    //   lastname: userData.lastname,
    //   firstname: userData.firstname,
    //   email: userData.email,
    //   password: userData.password,
    //   phone: userData.phone,
    //   address: userData.address,
    //   birthDate: userData.birthDate,
    //   isVerify: userData.isVerify,
    //   photoUrl: userData.photoUrl,
    //   updatedAt: userData.updatedAt,
    // };
    this.userDataSubject.next(userData);    
  }

  updateUserData(userData: UserCustomer): Observable<UserCustomer> {
    const url = `${this.endpointUrl}/${userData.id}`;
    console.log("from service : ", "\b", url, "\b", userData);

    return this.http.put<UserCustomer>(url, userData).pipe(
      catchError((error: any) => {
        // Gérez les erreurs ici (par exemple, affichez-les dans la console).
        console.error('Erreur lors de la mise à jour des données de l\'utilisateur :', error);
        // Vous pouvez également lancer une nouvelle erreur personnalisée ici si nécessaire.
        return throwError(error);
      })
    );;
  }

}
