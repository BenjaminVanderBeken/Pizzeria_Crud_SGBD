import { Injectable } from '@angular/core';
import type { Client, CreerClientDto, ModifierClientDto } from './electron-api';

@Injectable({ providedIn: 'root' })
export class ClientService {
  liste(): Promise<Client[]> {
    return this.api.liste();
  }

  creer(data: CreerClientDto): Promise<Client> {
    return this.api.creer(data);
  }

  modifier(id: number, data: ModifierClientDto): Promise<Client> {
    return this.api.modifier(id, data);
  }

  supprimer(id: number): Promise<Client> {
    return this.api.supprimer(id);
  }

  private get api() {
    const api = window.api?.clients;
    if (!api) throw new Error('API clients indisponible.');
    return api;
  }
}
