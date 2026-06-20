import { Injectable } from '@angular/core';
import type { Supplement, CreerSupplementDto, ModifierSupplementDto } from './electron-api';

@Injectable({ providedIn: 'root' })
export class SupplementService {
  liste(): Promise<Supplement[]> {
    return this.api.liste();
  }

  creer(data: CreerSupplementDto): Promise<Supplement> {
    return this.api.creer(data);
  }

  modifier(id: number, data: ModifierSupplementDto): Promise<Supplement> {
    return this.api.modifier(id, data);
  }

  supprimer(id: number): Promise<Supplement> {
    return this.api.supprimer(id);
  }

  private get api() {
    const api = window.api?.supplements;
    if (!api) throw new Error('API supplements indisponible.');
    return api;
  }
}
