import { Component, computed, inject, signal } from '@angular/core';
import { CategorieService } from '../../core/categorie.service';
import { CategorieFormulaire } from '../../composants/categorie-formulaire/categorie-formulaire';
import type { Categorie, CreerCategorieDto } from '../../core/electron-api';

@Component({
  selector: 'app-categories-page',
  imports: [CategorieFormulaire],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage {
  private readonly categorieService = inject(CategorieService);

  readonly categories = signal<Categorie[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);

  readonly afficherFormulaire = signal(false);
  readonly categorieEnEdition = signal<Categorie | null>(null);

  readonly nombreCategories = computed(() => this.categories().length);

  constructor() {
    void this.chargerCategories();
  }

  async chargerCategories(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);

    try {
      const liste = await this.categorieService.liste();
      this.categories.set(liste);
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Impossible de charger les categories.');
    } finally {
      this.chargement.set(false);
    }
  }

  ouvrirFormulaire(categorie?: Categorie): void {
    this.categorieEnEdition.set(categorie ?? null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire(): void {
    this.afficherFormulaire.set(false);
    this.categorieEnEdition.set(null);
  }

  async enregistrer(data: CreerCategorieDto): Promise<void> {
    try {
      const edition = this.categorieEnEdition();
      if (edition) {
        await this.categorieService.modifier(edition.id, data);
      } else {
        await this.categorieService.creer(data);
      }
      this.fermerFormulaire();
      await this.chargerCategories();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement.');
    }
  }

  async supprimer(id: number): Promise<void> {
    try {
      await this.categorieService.supprimer(id);
      await this.chargerCategories();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Impossible de supprimer cette categorie.');
    }
  }
}
