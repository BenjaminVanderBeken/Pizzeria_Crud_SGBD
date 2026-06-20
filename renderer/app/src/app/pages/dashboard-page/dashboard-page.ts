import { Component, computed, inject, signal } from '@angular/core';
import { StatistiquesService } from '../../core/statistiques.service';
import type { Compteurs } from '../../core/electron-api';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private readonly statsService = inject(StatistiquesService);

  readonly compteurs = signal<Compteurs | null>(null);
  readonly chiffreAffaires = signal(0);
  readonly chargement = signal(true);

  readonly totalEntites = computed(() => {
    const c = this.compteurs();
    if (!c) return 0;
    return c.categories + c.produits + c.clients + c.commandes + c.supplements;
  });

  constructor() {
    void this.charger();
  }

  async charger(): Promise<void> {
    this.chargement.set(true);

    try {
      const [compteurs, ca] = await Promise.all([
        this.statsService.compteurs(),
        this.statsService.chiffreAffaires(),
      ]);
      this.compteurs.set(compteurs);
      this.chiffreAffaires.set(ca);
    } catch (error) {
      console.error('Erreur chargement dashboard', error);
    } finally {
      this.chargement.set(false);
    }
  }
}
