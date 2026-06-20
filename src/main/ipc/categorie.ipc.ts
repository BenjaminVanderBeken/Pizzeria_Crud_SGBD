import { ipcMain } from 'electron';

import {
  creerCategorie,
  modifierCategorie,
  recupererCategorieParId,
  recupererCategories,
  supprimerCategorie,
  type CreerCategorieDto,
  type ModifierCategorieDto,
} from '../repositories/categorie.repository';

export function enregistrerCategorieIpc(): void {
  ipcMain.handle('categories:liste', async () => {
    try {
      return await recupererCategories();
    } catch (error) {
      console.error('Erreur categories:liste', error);
      throw error;
    }
  });

  ipcMain.handle('categories:detail', async (_event, id: number) => {
    try {
      return await recupererCategorieParId(id);
    } catch (error) {
      console.error('Erreur categories:detail', error);
      throw error;
    }
  });

  ipcMain.handle('categories:creer', async (_event, data: CreerCategorieDto) => {
    try {
      return await creerCategorie(data);
    } catch (error) {
      console.error('Erreur categories:creer', error);
      throw error;
    }
  });

  ipcMain.handle(
    'categories:modifier',
    async (_event, id: number, data: ModifierCategorieDto) => {
      try {
        return await modifierCategorie(id, data);
      } catch (error) {
        console.error('Erreur categories:modifier', error);
        throw error;
      }
    },
  );

  ipcMain.handle('categories:supprimer', async (_event, id: number) => {
    try {
      return await supprimerCategorie(id);
    } catch (error) {
      console.error('Erreur categories:supprimer', error);
      throw error;
    }
  });
}