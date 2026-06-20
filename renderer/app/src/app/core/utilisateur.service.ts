import { Injectable } from '@angular/core';
import type { Utilisateur, CreerUtilisateurDto, ModifierUtilisateurDto } from './electron-api';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  liste(): Promise<Utilisateur[]> {
    return this.api.liste();
  }

  creer(data: CreerUtilisateurDto): Promise<Utilisateur> {
    return this.api.creer(data);
  }

  modifier(id: number, data: ModifierUtilisateurDto): Promise<Utilisateur> {
    return this.api.modifier(id, data);
  }

  supprimer(id: number): Promise<Utilisateur> {
    return this.api.supprimer(id);
  }

  private get api() {
    const api = window.api?.utilisateurs;
    if (!api) throw new Error('API utilisateurs indisponible.');
    return api;
  }
}
