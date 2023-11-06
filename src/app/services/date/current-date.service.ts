import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentDateService {
  constructor() {}

  getAnneeActuelle(): string {
    return new Date().getFullYear().toString();
  }
}
