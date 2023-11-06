import { Injectable } from '@angular/core';
import { ageRanges } from 'src/app/models/ageRanges.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AgeService {
  calculateAgeCounts(users: User[]) {
    // Crée une copie des tranches d'âge pour éviter de modifier l'objet original
    const ageCounts = { ...ageRanges };
    
    users.forEach(user => {
      const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
      // Vous pouvez ajouter ici votre logique pour incrémenter le compteur de la tranche d'âge correcte
      if (age >= 10 && age < 20) ageCounts['10-20']++;
      else if (age >= 20 && age < 30) ageCounts['21-30']++;
      else if (age >= 30 && age < 40) ageCounts['31-40']++;
      else if (age >= 40 && age < 50) ageCounts['41-50']++;
      else if (age >= 50 && age < 60) ageCounts['51-60']++;
      else if (age >= 60 && age < 70) ageCounts['61-70']++;
      else if (age >= 70 && age < 80) ageCounts['71-80']++;
    });

    return ageCounts;
  }
}
