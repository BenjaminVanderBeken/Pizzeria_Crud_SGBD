import { prisma } from '../database/prisma';

export type CreerUtilisateurDto = {
  nom: string;
  prenom?: string | null;
  email: string;
  passwordHash: string;
  role?: string;
};

export type ModifierUtilisateurDto = {
  nom?: string;
  prenom?: string | null;
  email?: string;
  role?: string;
  actif?: boolean;
};

export function recupererUtilisateurs() {
  return prisma.utilisateur.findMany({
    orderBy: { nom: 'asc' },
  });
}

export function recupererUtilisateurParId(id: number) {
  return prisma.utilisateur.findUnique({
    where: { id },
  });
}

export function creerUtilisateur(data: CreerUtilisateurDto) {
  return prisma.utilisateur.create({
    data: {
      nom: data.nom,
      prenom: data.prenom ?? null,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role ?? 'CAISSIER',
    },
  });
}

export function modifierUtilisateur(id: number, data: ModifierUtilisateurDto) {
  return prisma.utilisateur.update({
    where: { id },
    data,
  });
}

export function supprimerUtilisateur(id: number) {
  return prisma.utilisateur.delete({
    where: { id },
  });
}
