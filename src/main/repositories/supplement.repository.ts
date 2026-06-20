import { prisma } from '../database/prisma';

export type CreerSupplementDto = {
  nom: string;
  type: string;
  prix: number;
  actif?: boolean;
};

export type ModifierSupplementDto = Partial<CreerSupplementDto>;

export function recupererSupplements() {
  return prisma.supplement.findMany({
    orderBy: { nom: 'asc' },
  });
}

export function recupererSupplementParId(id: number) {
  return prisma.supplement.findUnique({
    where: { id },
  });
}

export function creerSupplement(data: CreerSupplementDto) {
  return prisma.supplement.create({
    data: {
      nom: data.nom,
      type: data.type,
      prix: data.prix,
      actif: data.actif ?? true,
    },
  });
}

export function modifierSupplement(id: number, data: ModifierSupplementDto) {
  return prisma.supplement.update({
    where: { id },
    data,
  });
}

export function supprimerSupplement(id: number) {
  return prisma.supplement.delete({
    where: { id },
  });
}

export function compterSupplements() {
  return prisma.supplement.count();
}
