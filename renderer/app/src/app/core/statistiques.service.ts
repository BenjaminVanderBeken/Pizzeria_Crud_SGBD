import { Injectable } from '@angular/core';
import type { Compteurs } from './electron-api';

@Injectable({ providedIn: 'root' })
export class StatistiquesService {
  compteurs(): Promise<Compteurs> {
    return this.api.compteurs();
  }

  chiffreAffaires(): Promise<number> {
    return this.api.chiffreAffaires();
  }

  private get api() {
    const api = window.api?.statistiques;
    if (!api) throw new Error('API statistiques indisponible.');
    return api;
  }
}
