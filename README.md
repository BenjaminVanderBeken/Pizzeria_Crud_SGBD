# Gestion Pizzeria

Application de bureau pour la gestion d'une pizzeria, developpee avec **Electron**, **Angular** et **Prisma** (SQLite).


## Table des matieres

1. [Presentation](#presentation)
2. [Technologies](#technologies)
3. [Architecture](#architecture)
4. [Base de donnees](#base-de-donnees)
5. [Fonctionnalites](#fonctionnalites)
6. [Installation](#installation)
7. [Commandes utiles](#commandes-utiles)
8. [Structure du projet](#structure-du-projet)

---

## Presentation

Cette application permet de gerer les operations quotidiennes d'une pizzeria :

- Gestion du catalogue (categories, produits, supplements)
- Gestion des clients
- Gestion des commandes avec lignes de detail et supplements
- Tableau de bord avec statistiques et chiffre d'affaires
- Gestion des utilisateurs (admin / caissier)

L'application fonctionne en local avec une base de donnees SQLite embarquee. Aucun serveur externe n'est necessaire.

---

## Technologies

| Composant       | Technologie              | Version   |
|-----------------|--------------------------|-----------|
| Application     | Electron                 | 38        |
| Interface       | Angular                  | 20        |
| ORM             | Prisma                   | 7.8       |
| Base de donnees | SQLite (better-sqlite3)  | -         |
| Build           | Vite + Electron Forge    | -         |
| Langage         | TypeScript               | 6         |

---

## Architecture

L'application suit une architecture en couches. Le flux de donnees traverse :

```
Angular (interface)
  -> Service Angular
    -> window.api (contextBridge)
      -> Preload Electron (ipcRenderer.invoke)
        -> Main Process (ipcMain.handle)
          -> Repository
            -> Prisma Client
              -> SQLite (pizzeria.db)
```

### Separation des responsabilites

- **Angular** : affichage et interactions utilisateur uniquement
- **Preload** : expose une API limitee via `contextBridge` (securite Electron)
- **IPC** : couche controleur qui recoit les demandes et les transmet
- **Repository** : couche d'acces aux donnees, contient les requetes Prisma
- **Prisma** : ORM qui genere les requetes SQL et gere les relations

Le renderer Angular n'a jamais acces direct a Node.js, Electron ou Prisma.

---

## Base de donnees

### Schema relationnel

La base de donnees contient **8 tables** organisees en 4 blocs metier :

#### Catalogue
- **Categorie** : categories de produits (Pizzas, Boissons, Desserts, Entrees)
- **Produit** : produits de la carte avec prix, etat et options
- **Supplement** : supplements disponibles (fromage, viande, legume)

#### Ventes
- **Commande** : commandes avec numero unique, statut et montant
- **DetailCommande** : lignes de commande (produit, quantite, prix)
- **DetailSupplement** : supplements ajoutes a une ligne de commande

#### Clients
- **Client** : informations de contact des clients

#### Administration
- **Utilisateur** : comptes utilisateurs avec roles (admin / caissier)

### Relations

```
Categorie (1) ──── (N) Produit
Client    (1) ──── (N) Commande
Commande  (1) ──── (N) DetailCommande
Produit   (1) ──── (N) DetailCommande
DetailCommande (N) ──── (N) Supplement  (via DetailSupplement)
```

| Relation | Type | Cle etrangere | Comportement suppression |
|----------|------|---------------|--------------------------|
| Categorie → Produit | 1:N | `produit.categorieId` | RESTRICT (empeche la suppression) |
| Client → Commande | 1:N | `commande.clientId` (nullable) | SET NULL |
| Commande → DetailCommande | 1:N | `detailCommande.commandeId` | CASCADE (supprime les details) |
| Produit → DetailCommande | 1:N | `detailCommande.produitId` | RESTRICT |
| DetailCommande ↔ Supplement | N:M | Cle composite (`detailCommandeId`, `supplementId`) | CASCADE / RESTRICT |

### Contraintes

- **Cles primaires** : auto-increment (`id`) sur toutes les tables, cle composite sur `DetailSupplement`
- **Index UNIQUE** : `client.email`, `commande.numeroCommande`, `utilisateur.email`
- **Valeurs par defaut** : `actif = true`, `statut = EN_ATTENTE`, `dateCreation = CURRENT_TIMESTAMP`
- **Champs nullable** : `description`, `prenom`, `email` (client), `notes`, `clientId` (commande anonyme)

### Enumerations

| Enumeration | Valeurs |
|-------------|---------|
| StatutCommande | `EN_ATTENTE`, `EN_PREPARATION`, `TERMINEE`, `ANNULEE` |
| ModePaiement | `ESPECES`, `CARTE`, `EN_ATTENTE` |
| RoleUtilisateur | `ADMIN`, `CAISSIER` |

### Operations CRUD

Chaque entite dispose des 5 operations standard :

| Operation | Methode Prisma | Exemple |
|-----------|---------------|---------|
| **Lister** | `findMany` | Recuperer toutes les categories triees par ordre d'affichage |
| **Detail** | `findUnique` | Recuperer une commande avec ses details et le client |
| **Creer** | `create` | Creer une commande avec ses lignes en une seule transaction |
| **Modifier** | `update` | Changer le statut d'une commande |
| **Supprimer** | `delete` | Supprimer un client (avec contraintes referentielles) |

### Donnees de test (seed)

Le script `prisma/seed.ts` insere des donnees realistes :

- 4 categories (Pizzas, Boissons, Desserts, Entrees)
- 10 produits
- 5 supplements
- 3 clients
- 3 commandes avec details et supplements
- 2 utilisateurs (admin et caissier)

---

## Fonctionnalites

### Tableau de bord
- Compteurs par entite (categories, produits, clients, commandes, supplements)
- Chiffre d'affaires total (commandes terminees)
- Nombre total d'enregistrements

### Gestion des categories
- Lister, ajouter, modifier et supprimer des categories
- Champs : nom, description, ordre d'affichage, actif/inactif

### Gestion des produits
- Lister, ajouter, modifier et supprimer des produits
- Association a une categorie (relation 1:N)
- Champs : nom, prix, description, actif, populaire, permet supplements

### Gestion des clients
- Lister, ajouter, modifier et supprimer des clients
- Champs : nom, prenom, email (unique), telephone, notes

### Gestion des commandes
- Creer des commandes avec plusieurs lignes de produits
- Association optionnelle a un client (commande anonyme possible)
- Modifier le statut (en attente → en preparation → terminee / annulee)
- Calcul automatique des montants

### Gestion des supplements
- Lister, ajouter, modifier et supprimer des supplements
- Champs : nom, type, prix, actif/inactif

---

## Installation

### Prerequis

- **Node.js** >= 18
- **npm** >= 9

### Etapes

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd Pizzeria_CRUD_5

# 2. Installer les dependances
npm install

# 3. Generer le client Prisma
npm run prisma:generate

# 4. Appliquer la migration (cree la base pizzeria.db)
npm run prisma:migrate

# 5. Inserer les donnees de test
npm run seed

# 6. Compiler l'interface Angular
npm run build:angular

# 7. Lancer l'application
npm start
```

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm start` | Lancer l'application Electron |
| `npm run build:angular` | Compiler l'interface Angular |
| `npm run prisma:generate` | Regenerer le client Prisma |
| `npm run prisma:migrate` | Appliquer les migrations |
| `npm run prisma:studio` | Ouvrir Prisma Studio (interface web pour la base) |
| `npm run seed` | Reinitialiser les donnees de test |
| `npm run package` | Empaqueter l'application |
| `npm run make` | Creer un installateur |

---

## Structure du projet

```
Pizzeria_CRUD_5/
├── prisma/
│   ├── schema.prisma          # Schema de la base de donnees
│   ├── migrations/            # Migrations SQL versionnees
│   └── seed.ts                # Script de donnees de test
├── src/
│   ├── main/
│   │   ├── main.ts            # Point d'entree Electron
│   │   ├── database/
│   │   │   └── prisma.ts      # Connexion Prisma
│   │   ├── ipc/               # Handlers IPC (controleurs)
│   │   │   ├── index.ts
│   │   │   ├── categorie.ipc.ts
│   │   │   ├── produit.ipc.ts
│   │   │   ├── client.ipc.ts
│   │   │   ├── commande.ipc.ts
│   │   │   ├── supplement.ipc.ts
│   │   │   ├── utilisateur.ipc.ts
│   │   │   └── statistiques.ipc.ts
│   │   └── repositories/      # Acces aux donnees (Prisma)
│   │       ├── categorie.repository.ts
│   │       ├── produit.repository.ts
│   │       ├── client.repository.ts
│   │       ├── commande.repository.ts
│   │       ├── supplement.repository.ts
│   │       └── utilisateur.repository.ts
│   ├── preload/
│   │   └── preload.ts         # API exposee au renderer
│   └── prisma/generated/      # Client Prisma genere
├── renderer/
│   └── app/
│       ├── src/
│       │   └── app/
│       │       ├── app.html         # Layout principal (sidebar + contenu)
│       │       ├── app.routes.ts    # Routes Angular
│       │       ├── core/            # Services et types partages
│       │       └── pages/           # Pages de l'application
│       │           ├── dashboard-page/
│       │           ├── categories-page/
│       │           ├── produits-page/
│       │           ├── clients-page/
│       │           ├── commandes-page/
│       │           └── supplements-page/
│       └── public/assets/     # Images et ressources
├── docs/
│   └── ARCHITECTURE.md        # Documentation architecture
├── package.json
├── pizzeria.db                # Base de donnees SQLite
└── tsconfig.json
```
