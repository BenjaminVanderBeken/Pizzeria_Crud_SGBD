import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommandeService } from '../../core/commande.service';
import { ClientService } from '../../core/client.service';
import { ProduitService } from '../../core/produit.service';
import type { Commande, Client, Produit, CreerCommandeDto, LigneCommandeDto } from '../../core/electron-api';

@Component({
  selector: 'app-commandes-page',
  imports: [ReactiveFormsModule],
  templateUrl: './commandes-page.html',
  styleUrl: './commandes-page.css',
})
export class CommandesPage {
  private readonly commandeService = inject(CommandeService);
  private readonly clientService = inject(ClientService);
  private readonly produitService = inject(ProduitService);
  private readonly fb = inject(FormBuilder);

  readonly commandes = signal<Commande[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly produits = signal<Produit[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);

  readonly afficherFormulaire = signal(false);

  readonly nombreCommandes = computed(() => this.commandes().length);

  readonly formulaire = this.fb.group({
    clientId: [null as number | null],
    notes: [''],
    lignes: this.fb.array<ReturnType<typeof this.creerLigneGroup>>([]),
  });

  constructor() {
    effect(() => {
      const total = this.nombreCommandes();
      console.log('Nombre de commandes chargees :', total);
    });

    void this.charger();
  }

  get lignes(): FormArray {
    return this.formulaire.get('lignes') as FormArray;
  }

  async charger(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);

    try {
      const [commandes, clients, produits] = await Promise.all([
        this.commandeService.liste(),
        this.clientService.liste(),
        this.produitService.liste(),
      ]);
      this.commandes.set(commandes);
      this.clients.set(clients);
      this.produits.set(produits);
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur de chargement.');
    } finally {
      this.chargement.set(false);
    }
  }

  ouvrirFormulaire(): void {
    this.formulaire.reset();
    this.lignes.clear();
    this.ajouterLigne();
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire(): void {
    this.afficherFormulaire.set(false);
  }

  ajouterLigne(): void {
    this.lignes.push(this.creerLigneGroup());
  }

  supprimerLigne(index: number): void {
    this.lignes.removeAt(index);
  }

  private creerLigneGroup() {
    return this.fb.group({
      produitId: [0, Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
    });
  }

  async enregistrer(): Promise<void> {
    if (this.formulaire.invalid || this.lignes.length === 0) return;

    const v = this.formulaire.value;
    const lignesDto: LigneCommandeDto[] = (v.lignes ?? []).map((l) => {
      const produitId = Number(l.produitId ?? 0);
      const quantite = Number(l.quantite ?? 1);
      const produit = this.produits().find((p) => p.id === produitId);
      const prix = produit?.prixBase ?? 0;
      return {
        produitId,
        quantite,
        prixUnitaire: prix,
        prixTotal: prix * quantite,
      };
    });

    const sousTotal = lignesDto.reduce((s, l) => s + l.prixTotal, 0);

    const data: CreerCommandeDto = {
      clientId: v.clientId ? Number(v.clientId) : null,
      sousTotal,
      montantTotal: sousTotal,
      notes: v.notes || null,
      lignes: lignesDto,
    };

    try {
      await this.commandeService.creer(data);
      this.fermerFormulaire();
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur lors de la creation.');
    }
  }

  async modifierStatut(commande: Commande, statut: string): Promise<void> {
    try {
      await this.commandeService.modifier(commande.id, { statut });
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur lors de la modification.');
    }
  }

  async supprimer(id: number): Promise<void> {
    try {
      await this.commandeService.supprimer(id);
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Impossible de supprimer cette commande.');
    }
  }
}
