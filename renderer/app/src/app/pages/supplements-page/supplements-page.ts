import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupplementService } from '../../core/supplement.service';
import type { Supplement, CreerSupplementDto } from '../../core/electron-api';

@Component({
  selector: 'app-supplements-page',
  imports: [ReactiveFormsModule],
  templateUrl: './supplements-page.html',
  styleUrl: './supplements-page.css',
})
export class SupplementsPage {
  private readonly supplementService = inject(SupplementService);
  private readonly fb = inject(FormBuilder);

  readonly supplements = signal<Supplement[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);

  readonly afficherFormulaire = signal(false);
  readonly supplementEnEdition = signal<Supplement | null>(null);

  readonly nombreSupplements = computed(() => this.supplements().length);

  readonly formulaire = this.fb.group({
    nom: ['', Validators.required],
    type: ['', Validators.required],
    prix: [0, [Validators.required, Validators.min(0)]],
    actif: [true],
  });

  constructor() {
    void this.charger();
  }

  async charger(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);

    try {
      this.supplements.set(await this.supplementService.liste());
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur de chargement.');
    } finally {
      this.chargement.set(false);
    }
  }

  ouvrirFormulaire(supplement?: Supplement): void {
    this.supplementEnEdition.set(supplement ?? null);
    if (supplement) {
      this.formulaire.patchValue({
        nom: supplement.nom,
        type: supplement.type,
        prix: supplement.prix,
        actif: supplement.actif,
      });
    } else {
      this.formulaire.reset({ actif: true, prix: 0 });
    }
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire(): void {
    this.afficherFormulaire.set(false);
    this.supplementEnEdition.set(null);
  }

  async enregistrer(): Promise<void> {
    if (this.formulaire.invalid) return;

    const v = this.formulaire.value;
    const data: CreerSupplementDto = {
      nom: v.nom!,
      type: v.type!,
      prix: v.prix!,
      actif: v.actif ?? true,
    };

    try {
      const edition = this.supplementEnEdition();
      if (edition) {
        await this.supplementService.modifier(edition.id, data);
      } else {
        await this.supplementService.creer(data);
      }
      this.fermerFormulaire();
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement.');
    }
  }

  async supprimer(id: number): Promise<void> {
    try {
      await this.supplementService.supprimer(id);
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Impossible de supprimer ce supplement.');
    }
  }
}
