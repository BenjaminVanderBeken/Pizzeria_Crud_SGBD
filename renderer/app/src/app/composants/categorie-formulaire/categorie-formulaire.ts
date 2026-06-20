import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import type { Categorie, CreerCategorieDto } from '../../core/electron-api';

@Component({
  selector: 'app-categorie-formulaire',
  imports: [ReactiveFormsModule],
  templateUrl: './categorie-formulaire.html',
  styleUrl: './categorie-formulaire.css',
})
export class CategorieFormulaire {
  readonly categorie = input<Categorie | null>(null);

  readonly enregistrer = output<CreerCategorieDto>();
  readonly annuler = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly formulaire = this.fb.group({
    nom: ['', Validators.required],
    description: [''],
    ordreAffichage: [0],
    actif: [true],
  });

  ngOnInit(): void {
    const cat = this.categorie();
    if (cat) {
      this.formulaire.patchValue({
        nom: cat.nom,
        description: cat.description ?? '',
        ordreAffichage: cat.ordreAffichage,
        actif: cat.actif,
      });
    }
  }

  soumettre(): void {
    if (this.formulaire.invalid) return;

    const valeurs = this.formulaire.value;
    this.enregistrer.emit({
      nom: valeurs.nom!,
      description: valeurs.description || null,
      ordreAffichage: valeurs.ordreAffichage ?? 0,
      actif: valeurs.actif ?? true,
    });
  }
}
