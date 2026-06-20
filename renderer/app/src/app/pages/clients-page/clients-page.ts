import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../../core/client.service';
import type { Client, CreerClientDto } from '../../core/electron-api';

@Component({
  selector: 'app-clients-page',
  imports: [ReactiveFormsModule],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.css',
})
export class ClientsPage {
  private readonly clientService = inject(ClientService);
  private readonly fb = inject(FormBuilder);

  readonly clients = signal<Client[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);

  readonly afficherFormulaire = signal(false);
  readonly clientEnEdition = signal<Client | null>(null);

  readonly nombreClients = computed(() => this.clients().length);

  readonly formulaire = this.fb.group({
    nom: ['', Validators.required],
    prenom: [''],
    email: [''],
    telephone: [''],
    notes: [''],
  });

  constructor() {
    void this.charger();
  }

  async charger(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);

    try {
      this.clients.set(await this.clientService.liste());
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur de chargement.');
    } finally {
      this.chargement.set(false);
    }
  }

  ouvrirFormulaire(client?: Client): void {
    this.clientEnEdition.set(client ?? null);
    if (client) {
      this.formulaire.patchValue({
        nom: client.nom,
        prenom: client.prenom ?? '',
        email: client.email ?? '',
        telephone: client.telephone ?? '',
        notes: client.notes ?? '',
      });
    } else {
      this.formulaire.reset();
    }
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire(): void {
    this.afficherFormulaire.set(false);
    this.clientEnEdition.set(null);
  }

  async enregistrer(): Promise<void> {
    if (this.formulaire.invalid) return;

    const v = this.formulaire.value;
    const data: CreerClientDto = {
      nom: v.nom!,
      prenom: v.prenom || null,
      email: v.email || null,
      telephone: v.telephone || null,
      notes: v.notes || null,
    };

    try {
      const edition = this.clientEnEdition();
      if (edition) {
        await this.clientService.modifier(edition.id, data);
      } else {
        await this.clientService.creer(data);
      }
      this.fermerFormulaire();
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement.');
    }
  }

  async supprimer(id: number): Promise<void> {
    try {
      await this.clientService.supprimer(id);
      await this.charger();
    } catch (error) {
      this.erreur.set(error instanceof Error ? error.message : 'Impossible de supprimer ce client.');
    }
  }
}
