import { prisma } from '../database/prisma';

export type CreerCategorieDto = {
  nom: string;
  description?: string | null;
  ordreAffichage?: number;
  actif?: boolean;
};

export type ModifierCategorieDto = Partial<CreerCategorieDto>;

export function recupererCategories() {
  return prisma.categorie.findMany({
    orderBy: [
      { ordreAffichage: 'asc' },
      { nom: 'asc' },
    ],
    include: { produits: true },
  });
}

export function recupererCategorieParId(id: number) {
  return prisma.categorie.findUnique({
    where: { id },
    include: { produits: true },
  });
}

export function creerCategorie(data: CreerCategorieDto) {
  return prisma.categorie.create({
    data: {
      nom: data.nom,
      description: data.description ?? null,
      ordreAffichage: data.ordreAffichage ?? 0,
      actif: data.actif ?? true,
    },
  });
}

export function modifierCategorie(id: number, data: ModifierCategorieDto) {
  return prisma.categorie.update({
    where: { id },
    data,
  });
}

export function supprimerCategorie(id: number) {
  return prisma.categorie.delete({
    where: { id },
  });
}

export function compterCategories() {
  return prisma.categorie.count();
}
