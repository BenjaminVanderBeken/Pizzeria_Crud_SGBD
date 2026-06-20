import { ipcMain } from 'electron';

import {
  creerSupplement,
  modifierSupplement,
  recupererSupplementParId,
  recupererSupplements,
  supprimerSupplement,
  type CreerSupplementDto,
  type ModifierSupplementDto,
} from '../repositories/supplement.repository';

export function enregistrerSupplementIpc(): void {
  ipcMain.handle('supplements:liste', async () => {
    try {
      return await recupererSupplements();
    } catch (error) {
      console.error('Erreur supplements:liste', error);
      throw error;
    }
  });

  ipcMain.handle('supplements:detail', async (_event, id: number) => {
    try {
      return await recupererSupplementParId(id);
    } catch (error) {
      console.error('Erreur supplements:detail', error);
      throw error;
    }
  });

  ipcMain.handle('supplements:creer', async (_event, data: CreerSupplementDto) => {
    try {
      return await creerSupplement(data);
    } catch (error) {
      console.error('Erreur supplements:creer', error);
      throw error;
    }
  });

  ipcMain.handle(
    'supplements:modifier',
    async (_event, id: number, data: ModifierSupplementDto) => {
      try {
        return await modifierSupplement(id, data);
      } catch (error) {
        console.error('Erreur supplements:modifier', error);
        throw error;
      }
    },
  );

  ipcMain.handle('supplements:supprimer', async (_event, id: number) => {
    try {
      return await supprimerSupplement(id);
    } catch (error) {
      console.error('Erreur supplements:supprimer', error);
      throw error;
    }
  });
}
