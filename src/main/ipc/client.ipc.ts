import { ipcMain } from 'electron';

import {
  creerClient,
  modifierClient,
  recupererClientParId,
  recupererClients,
  supprimerClient,
  type CreerClientDto,
  type ModifierClientDto,
} from '../repositories/client.repository';

export function enregistrerClientIpc(): void {
  ipcMain.handle('clients:liste', async () => {
    try {
      return await recupererClients();
    } catch (error) {
      console.error('Erreur clients:liste', error);
      throw error;
    }
  });

  ipcMain.handle('clients:detail', async (_event, id: number) => {
    try {
      return await recupererClientParId(id);
    } catch (error) {
      console.error('Erreur clients:detail', error);
      throw error;
    }
  });

  ipcMain.handle('clients:creer', async (_event, data: CreerClientDto) => {
    try {
      return await creerClient(data);
    } catch (error) {
      console.error('Erreur clients:creer', error);
      throw error;
    }
  });

  ipcMain.handle(
    'clients:modifier',
    async (_event, id: number, data: ModifierClientDto) => {
      try {
        return await modifierClient(id, data);
      } catch (error) {
        console.error('Erreur clients:modifier', error);
        throw error;
      }
    },
  );

  ipcMain.handle('clients:supprimer', async (_event, id: number) => {
    try {
      return await supprimerClient(id);
    } catch (error) {
      console.error('Erreur clients:supprimer', error);
      throw error;
    }
  });
}
