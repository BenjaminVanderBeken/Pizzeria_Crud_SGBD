import { Injectable } from '@angular/core';
import type { Produit, CreerProduitDto, ModifierProduitDto } from './electron-api';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  liste(): Promise<Produit[]> {
    return this.api.liste();
  }

  creer(data: CreerProduitDto): Promise<Produit> {
    return this.api.creer(data);
  }

  modifier(id: number, data: ModifierProduitDto): Promise<Produit> {
    return this.api.modifier(id, data);
  }

  supprimer(id: number): Promise<Produit> {
    return this.api.supprimer(id);
  }

  private get api() {
    const api = window.api?.produits;
    if (!api) throw new Error('API produits indisponible.');
    return api;
  }
}
