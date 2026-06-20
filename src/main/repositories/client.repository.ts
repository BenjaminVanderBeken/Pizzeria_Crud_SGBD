import { prisma } from '../database/prisma';

export type CreerClientDto = {
  nom: string;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  notes?: string | null;
};

export type ModifierClientDto = Partial<CreerClientDto>;

export function recupererClients() {
  return prisma.client.findMany({
    orderBy: { nom: 'asc' },
  });
}

export function recupererClientParId(id: number) {
  return prisma.client.findUnique({
    where: { id },
    include: { commandes: true },
  });
}

export function creerClient(data: CreerClientDto) {
  return prisma.client.create({
    data: {
      nom: data.nom,
      prenom: data.prenom ?? null,
      email: data.email ?? null,
      telephone: data.telephone ?? null,
      notes: data.notes ?? null,
    },
  });
}

export function modifierClient(id: number, data: ModifierClientDto) {
  return prisma.client.update({
    where: { id },
    data,
  });
}

export function supprimerClient(id: number) {
  return prisma.client.delete({
    where: { id },
  });
}

export function compterClients() {
  return prisma.client.count();
}
