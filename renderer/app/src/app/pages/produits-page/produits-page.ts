import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProduitService } from '../../core/produit.service';
import { CategorieService } from '../../core/categorie.service';
import type { Produit, Categorie, CreerProduitDto } from '../../core/electron-api';

@Component({
  selector: 'app-produits-page',
  imports: [ReactiveFormsModule],
  templateUrl: './produits-page.html',
  styleUrl: './produits-page.css',
})
export class ProduitsPage {
  private readonly produitService = inject(ProduitService);
  private readonly categorieService = inject(CategorieService);
  private readonly fb = inject(FormBuilder);

  readonly produits = signal<Produit[]>([]);
  readonly categories = signal<Categorie[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);

  readonly afficherFormulaire = signal(false);
  readonly produitEnEdition = signal<Produit | null>(null);

  readonly nombreProduits = computed(() => this.produits().length);

  readonly formulaire = this.fb.group({
    nom: ['', Validators.required],
    categorieId: [0, Validators.required],
    prixBase: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    actif: [true],
    populaire: [false],
    permetSupplement: [false],
  });

  constructor() {
    void this.charger();
  }

  async charger(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);

    try {
      const [produits, categories] = await Promise.all([
        this.produitService.liste(),
        this.categorieService.liste(),
      ]);
      this.produits.set(produits);
      this.categories.set(categories);
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur de chargement.');
    } finally {
      this.chargement.set(false);
    }
  }

  ouvrirFormulaire(produit?: Produit): void {
    this.produitEnEdition.set(produit ?? null);
    if (produit) {
      this.formulaire.patchValue({
        nom: produit.nom,
        categorieId: produit.categorieId,
        prixBase: produit.prixBase,
        description: produit.description ?? '',
        actif: produit.actif,
        populaire: produit.populaire,
        permetSupplement: produit.permetSupplement,
      });
    } else {
      this.formulaire.reset({ actif: true, populaire: false, permetSupplement: false, prixBase: 0, categorieId: 0 });
    }
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire(): void {
    this.afficherFormulaire.set(false);
    this.produitEnEdition.set(null);
  }

  async enregistrer(): Promise<void> {
    if (this.formulaire.invalid) return;

    const v = this.formulaire.value;
    const data: CreerProduitDto = {
      nom: v.nom!,
      categorieId: v.categorieId!,
      prixBase: v.prixBase!,
      description: v.description || null,
      actif: v.actif ?? true,
      populaire: v.populaire ?? false,
      permetSupplement: v.permetSupplement ?? false,
    };

    try {
      const edition = this.produitEnEdition();
      if (edition) {
        await this.produitService.modifier(edition.id, data);
      } else {
        await this.produitService.creer(data);
      }
      this.fermerFormulaire();
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement.');
    }
  }

  async supprimer(id: number): Promise<void> {
    try {
      await this.produitService.supprimer(id);
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Impossible de supprimer ce produit.');
    }
  }
}
