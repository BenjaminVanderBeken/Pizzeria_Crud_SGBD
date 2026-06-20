// ── Types des entités ──

export type Categorie = {
  id: number;
  nom: string;
  description: string | null;
  ordreAffichage: number;
  actif: boolean;
  dateCreation: string;
  dateModification: string;
  produits?: Produit[];
};

export type Produit = {
  id: number;
  categorieId: number;
  nom: string;
  description: string | null;
  prixBase: number;
  actif: boolean;
  populaire: boolean;
  permetSupplement: boolean;
  dateCreation: string;
  dateModification: string;
  categorie?: Categorie;
};

export type Client = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  notes: string | null;
  actif: boolean;
  dateCreation: string;
  dateModification: string;
};

export type Commande = {
  id: number;
  numeroCommande: string;
  clientId: number | null;
  dateCommande: string;
  statut: string;
  modePaiement: string;
  sousTotal: number;
  tvaMontant: number;
  reductionMontant: number;
  montantTotal: number;
  notes: string | null;
  client?: Client | null;
  details?: DetailCommande[];
};

export type DetailCommande = {
  id: number;
  commandeId: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  notes: string | null;
  produit?: Produit;
};

export type Supplement = {
  id: number;
  nom: string;
  type: string;
  prix: number;
  actif: boolean;
  dateCreation: string;
};

export type Utilisateur = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
  role: string;
  actif: boolean;
  dateCreation: string;
};

export type Compteurs = {
  categories: number;
  produits: number;
  clients: number;
  commandes: number;
  supplements: number;
};

// ── Types des DTO ──

export type CreerCategorieDto = {
  nom: string;
  description?: string | null;
  ordreAffichage?: number;
  actif?: boolean;
};

export type ModifierCategorieDto = Partial<CreerCategorieDto>;

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

export type CreerClientDto = {
  nom: string;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  notes?: string | null;
};

export type ModifierClientDto = Partial<CreerClientDto>;

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

export type CreerSupplementDto = {
  nom: string;
  type: string;
  prix: number;
  actif?: boolean;
};

export type ModifierSupplementDto = Partial<CreerSupplementDto>;

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

// ── Type de l'API exposée par le preload ──

type CrudApi<T, C, M> = {
  liste: () => Promise<T[]>;
  detail: (id: number) => Promise<T | null>;
  creer: (data: C) => Promise<T>;
  modifier: (id: number, data: M) => Promise<T>;
  supprimer: (id: number) => Promise<T>;
};

export type ElectronApi = {
  categories: CrudApi<Categorie, CreerCategorieDto, ModifierCategorieDto>;
  produits: CrudApi<Produit, CreerProduitDto, ModifierProduitDto>;
  clients: CrudApi<Client, CreerClientDto, ModifierClientDto>;
  commandes: CrudApi<Commande, CreerCommandeDto, ModifierCommandeDto>;
  supplements: CrudApi<Supplement, CreerSupplementDto, ModifierSupplementDto>;
  utilisateurs: CrudApi<Utilisateur, CreerUtilisateurDto, ModifierUtilisateurDto>;
  statistiques: {
    compteurs: () => Promise<Compteurs>;
    chiffreAffaires: () => Promise<number>;
  };
};

declare global {
  interface Window {
    api?: ElectronApi;
  }
}
