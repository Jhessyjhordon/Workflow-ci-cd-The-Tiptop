import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ShortcutedBatch } from 'src/app/models/batch-shortcut.model';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

  private endpointUrl = 'https://api.dsp-archiwebo22b-ji-rw-ah.fr'; // Endpoint de l'API 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // récupère le lot en fonction de l'ID du batch
  getBatcheById(batcheId: number): Observable<any> {
    const url = `${this.endpointUrl}/batch/${batcheId}`;
    console.log(batcheId);
    return this.http.get<{ batch: any }>(url)
      .pipe(
        map(response => response.batch),
        catchError(error => {
          console.error('Une erreur s\'est produite lors de la récupération des données du lot:', error);
          return throwError(error);
        })
      );
  }

  // Mise a jour du lot en fonction de l'ID du batch
  patchBatchById(id: number, data: object): Observable<any> {
    const url = `${this.endpointUrl}/batch/${id}`;
    return this.http.patch(url, data);
  }

  // récupère le lot en fonction de l'ID du user connecté
  getBatchByUserToken(): Observable<any> {
    const url = `${this.endpointUrl}/batch/retrieve`;

    // Obtenez le token à partir de votre service d'authentification
    const token = this.authService.getToken();

    // Ajoutez le token à l'en-tête de la requête
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Utilisez les options pour spécifier les en-têtes
    const options = { headers: headers };

    return this.http.post<{ batch: any }>(url, null, options)
      .pipe(
        map(response => response.batch),
        catchError(error => {
          console.error('Une erreur s\'est produite lors de la récupération des données du lot:', error);
          return throwError(error);
        })
      );
  }


  // patchTicketUserId(id: number, data: object): Observable<any> {
  //   const url = `${this.endpointUrl}/ticket/${id}`;
  //   return this.http.patch(url, data);
  // }

  getShortcutedBatchs(): Observable<ShortcutedBatch[]> {
    const url = `${this.endpointUrl}/batch/shortcuted/details`;

    return this.http.get<{batchs:ShortcutedBatch[]}>(url).pipe(
      map(response => response.batchs)
    );
  }


}
