import { prisma } from '../database/prisma';

export type CreerProduitDto = {
  nom: string;
  categorieId: number;
  prixBase: number;
  description?: string | null;
  actif?: boolean;
  populaire?: boolean;
  permetSupplement?: boolean;
};

export type ModifierProduitDto = Partial<CreerProduitDto>;

export function recupererProduits() {
  return prisma.produit.findMany({
    orderBy: { nom: 'asc' },
    include: { categorie: true },
  });
}

export function recupererProduitParId(id: number) {
  return prisma.produit.findUnique({
    where: { id },
    include: { categorie: true },
  });
}

export function creerProduit(data: CreerProduitDto) {
  return prisma.produit.create({
    data: {
      nom: data.nom,
      categorieId: data.categorieId,
      prixBase: data.prixBase,
      description: data.description ?? null,
      actif: data.actif ?? true,
      populaire: data.populaire ?? false,
      permetSupplement: data.permetSupplement ?? false,
    },
  });
}

export function modifierProduit(id: number, data: ModifierProduitDto) {
  return prisma.produit.update({
    where: { id },
    data,
  });
}

export function supprimerProduit(id: number) {
  return prisma.produit.delete({
    where: { id },
  });
}

export function compterProduits() {
  return prisma.produit.count();
}
