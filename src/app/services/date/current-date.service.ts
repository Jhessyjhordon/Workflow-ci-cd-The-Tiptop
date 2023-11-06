import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentDateService {
  constructor() {}

  getAnneeActuelle(): number {
    return new Date().getFullYear();
  }
}
