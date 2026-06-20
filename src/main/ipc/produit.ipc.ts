import { ipcMain } from 'electron';

import {
  creerProduit,
  modifierProduit,
  recupererProduitParId,
  recupererProduits,
  supprimerProduit,
  type CreerProduitDto,
  type ModifierProduitDto,
} from '../repositories/produit.repository';

export function enregistrerProduitIpc(): void {
  ipcMain.handle('produits:liste', async () => {
    try {
      return await recupererProduits();
    } catch (error) {
      console.error('Erreur produits:liste', error);
      throw error;
    }
  });

  ipcMain.handle('produits:detail', async (_event, id: number) => {
    try {
      return await recupererProduitParId(id);
    } catch (error) {
      console.error('Erreur produits:detail', error);
      throw error;
    }
  });

  ipcMain.handle('produits:creer', async (_event, data: CreerProduitDto) => {
    try {
      data.categorieId = Number(data.categorieId);
      data.prixBase = Number(data.prixBase);
      return await creerProduit(data);
    } catch (error) {
      console.error('Erreur produits:creer', error);
      throw error;
    }
  });

  ipcMain.handle(
    'produits:modifier',
    async (_event, id: number, data: ModifierProduitDto) => {
      try {
        if (data.categorieId !== undefined) data.categorieId = Number(data.categorieId);
        if (data.prixBase !== undefined) data.prixBase = Number(data.prixBase);
        return await modifierProduit(Number(id), data);
      } catch (error) {
        console.error('Erreur produits:modifier', error);
        throw error;
      }
    },
  );

  ipcMain.handle('produits:supprimer', async (_event, id: number) => {
    try {
      return await supprimerProduit(id);
    } catch (error) {
      console.error('Erreur produits:supprimer', error);
      throw error;
    }
  });
}
