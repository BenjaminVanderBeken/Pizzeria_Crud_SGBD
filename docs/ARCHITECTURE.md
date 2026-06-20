# Architecture de l'application Pizzeria

Ce projet se lit de gauche a droite, depuis l'ecran jusqu'a la base de donnees.

```text
Angular
  -> Service renderer
    -> window.api
      -> preload Electron
        -> ipcRenderer.invoke(...)
          -> ipcMain.handle(...)
            -> repository
              -> Prisma Client
                -> SQLite
```

## 1. Interface Angular

Le dossier `renderer/app/src/app` contient l'interface visible par l'utilisateur.

- `app.html` affiche la structure principale avec le menu.
- `app.routes.ts` organise la navigation entre les pages.
- `pages/` contient les ecrans metier.
- `core/` contient les services et les types partages cote renderer.

Exemple avec les categories :

```text
pages/categories-page
  -> CategorieService
```

## 2. Service renderer

Le service Angular cache les details Electron au composant.

```text
CategoriePage
  -> CategorieService.liste()
```

Le composant ne sait pas comment la base de donnees fonctionne. Il demande seulement des donnees.

## 3. Preload et contextBridge

Le fichier `src/preload/preload.ts` expose une API limitee dans le renderer :

```text
window.api.categories.liste()
window.api.categories.creer(...)
window.api.categories.modifier(...)
window.api.categories.supprimer(...)
```

Cette couche est importante parce que le renderer Angular ne doit pas acceder directement a Node.js, Electron ou Prisma.

## 4. IPC Electron

Le fichier `src/main/ipc/index.ts` enregistre tous les modules IPC.

Chaque module IPC gere ensuite un domaine metier. Par exemple, `src/main/ipc/categorie.ipc.ts` recoit les demandes envoyees par le preload.

```text
categories:liste
categories:detail
categories:creer
categories:modifier
categories:supprimer
```

On peut presenter cette couche comme un petit controleur backend local.

## 5. Repository

Le fichier `src/main/repositories/categorie.repository.ts` contient les requetes Prisma.

Cette couche evite de melanger :

- la logique Electron ;
- la logique SQL/Prisma ;
- la logique d'affichage Angular.

## 6. Prisma et SQLite

Le fichier `prisma/schema.prisma` decrit les tables et les relations.

Les principaux blocs metier sont :

- Catalogue : `Categorie`, `Produit`, `Supplement`
- Vente : `Commande`, `DetailCommande`, `DetailSupplement`
- Client : `Client`
- Administration : `Utilisateur`

## Exemple de phrase pour l'oral

Quand l'utilisateur ouvre la page Categories, Angular appelle un service. Ce service utilise `window.api`, qui vient du preload Electron. Le preload envoie une demande IPC au main process. Le main process appelle un repository, le repository interroge Prisma, et Prisma lit la base SQLite. Le resultat remonte ensuite dans l'autre sens jusqu'a l'interface.
