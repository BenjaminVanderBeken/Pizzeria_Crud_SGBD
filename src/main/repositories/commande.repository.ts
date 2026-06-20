import { prisma } from '../database/prisma';

export type LigneCommandeDto = {
  produitId: number;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  notes?: string | null;
};

export type CreerCommandeDto = {
  clientId?: number | null;
  sousTotal: number;
  tvaMontant?: number;
  reductionMontant?: number;
  montantTotal: number;
  notes?: string | null;
  lignes: LigneCommandeDto[];
};

export type ModifierCommandeDto = {
  statut?: string;
  modePaiement?: string;
  notes?: string | null;
};

export function recupererCommandes() {
  return prisma.commande.findMany({
    orderBy: { dateCommande: 'desc' },
    include: {
      client: true,
      details: {
        include: { produit: true },
      },
    },
  });
}

export function recupererCommandeParId(id: number) {
  return prisma.commande.findUnique({
    where: { id },
    include: {
      client: true,
      details: {
        include: {
          produit: true,
          supplements: {
            include: { supplement: true },
          },
        },
      },
    },
  });
}

export function creerCommande(data: CreerCommandeDto) {
  const numero = 'CMD-' + Date.now();

  return prisma.commande.create({
    data: {
      numeroCommande: numero,
      clientId: data.clientId ?? null,
      sousTotal: data.sousTotal,
      tvaMontant: data.tvaMontant ?? 0,
      reductionMontant: data.reductionMontant ?? 0,
      montantTotal: data.montantTotal,
      notes: data.notes ?? null,
      details: {
        create: data.lignes.map((ligne) => ({
          produitId: ligne.produitId,
          quantite: ligne.quantite,
          prixUnitaire: ligne.prixUnitaire,
          prixTotal: ligne.prixTotal,
          notes: ligne.notes ?? null,
        })),
      },
    },
    include: {
      client: true,
      details: { include: { produit: true } },
    },
  });
}

export function modifierCommande(id: number, data: ModifierCommandeDto) {
  return prisma.commande.update({
    where: { id },
    data,
  });
}

export function supprimerCommande(id: number) {
  return prisma.commande.delete({
    where: { id },
  });
}

export function compterCommandes() {
  return prisma.commande.count();
}

export function calculerChiffreAffaires() {
  return prisma.commande.aggregate({
    _sum: { montantTotal: true },
    where: { statut: 'TERMINEE' },
  });
}
