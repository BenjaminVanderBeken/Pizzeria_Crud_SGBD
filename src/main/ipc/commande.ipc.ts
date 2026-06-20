import { ipcMain } from 'electron';

import {
  creerCommande,
  modifierCommande,
  recupererCommandeParId,
  recupererCommandes,
  supprimerCommande,
  type CreerCommandeDto,
  type ModifierCommandeDto,
} from '../repositories/commande.repository';

export function enregistrerCommandeIpc(): void {
  ipcMain.handle('commandes:liste', async () => {
    try {
      return await recupererCommandes();
    } catch (error) {
      console.error('Erreur commandes:liste', error);
      throw error;
    }
  });

  ipcMain.handle('commandes:detail', async (_event, id: number) => {
    try {
      return await recupererCommandeParId(id);
    } catch (error) {
      console.error('Erreur commandes:detail', error);
      throw error;
    }
  });

  ipcMain.handle('commandes:creer', async (_event, data: CreerCommandeDto) => {
    try {
      return await creerCommande(data);
    } catch (error) {
      console.error('Erreur commandes:creer', error);
      throw error;
    }
  });

  ipcMain.handle(
    'commandes:modifier',
    async (_event, id: number, data: ModifierCommandeDto) => {
      try {
        return await modifierCommande(id, data);
      } catch (error) {
        console.error('Erreur commandes:modifier', error);
        throw error;
      }
    },
  );

  ipcMain.handle('commandes:supprimer', async (_event, id: number) => {
    try {
      return await supprimerCommande(id);
    } catch (error) {
      console.error('Erreur commandes:supprimer', error);
      throw error;
    }
  });
}
