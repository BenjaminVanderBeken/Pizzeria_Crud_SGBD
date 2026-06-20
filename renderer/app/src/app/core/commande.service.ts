import { Injectable } from '@angular/core';
import type { Commande, CreerCommandeDto, ModifierCommandeDto } from './electron-api';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  liste(): Promise<Commande[]> {
    return this.api.liste();
  }

  creer(data: CreerCommandeDto): Promise<Commande> {
    return this.api.creer(data);
  }

  modifier(id: number, data: ModifierCommandeDto): Promise<Commande> {
    return this.api.modifier(id, data);
  }

  supprimer(id: number): Promise<Commande> {
    return this.api.supprimer(id);
  }

  private get api() {
    const api = window.api?.commandes;
    if (!api) throw new Error('API commandes indisponible.');
    return api;
  }
}
