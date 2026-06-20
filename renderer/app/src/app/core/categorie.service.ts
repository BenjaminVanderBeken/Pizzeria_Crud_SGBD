import { Injectable } from '@angular/core';
import type { Categorie, CreerCategorieDto, ModifierCategorieDto } from './electron-api';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  liste(): Promise<Categorie[]> {
    return this.api.liste();
  }

  creer(data: CreerCategorieDto): Promise<Categorie> {
    return this.api.creer(data);
  }

  modifier(id: number, data: ModifierCategorieDto): Promise<Categorie> {
    return this.api.modifier(id, data);
  }

  supprimer(id: number): Promise<Categorie> {
    return this.api.supprimer(id);
  }

  private get api() {
    const api = window.api?.categories;
    if (!api) throw new Error('API categories indisponible.');
    return api;
  }
}
