import { ipcMain } from 'electron';

import {
  creerUtilisateur,
  modifierUtilisateur,
  recupererUtilisateurParId,
  recupererUtilisateurs,
  supprimerUtilisateur,
  type CreerUtilisateurDto,
  type ModifierUtilisateurDto,
} from '../repositories/utilisateur.repository';

export function enregistrerUtilisateurIpc(): void {
  ipcMain.handle('utilisateurs:liste', async () => {
    try {
      return await recupererUtilisateurs();
    } catch (error) {
      console.error('Erreur utilisateurs:liste', error);
      throw error;
    }
  });

  ipcMain.handle('utilisateurs:detail', async (_event, id: number) => {
    try {
      return await recupererUtilisateurParId(id);
    } catch (error) {
      console.error('Erreur utilisateurs:detail', error);
      throw error;
    }
  });

  ipcMain.handle('utilisateurs:creer', async (_event, data: CreerUtilisateurDto) => {
    try {
      return await creerUtilisateur(data);
    } catch (error) {
      console.error('Erreur utilisateurs:creer', error);
      throw error;
    }
  });

  ipcMain.handle(
    'utilisateurs:modifier',
    async (_event, id: number, data: ModifierUtilisateurDto) => {
      try {
        return await modifierUtilisateur(id, data);
      } catch (error) {
        console.error('Erreur utilisateurs:modifier', error);
        throw error;
      }
    },
  );

  ipcMain.handle('utilisateurs:supprimer', async (_event, id: number) => {
    try {
      return await supprimerUtilisateur(id);
    } catch (error) {
      console.error('Erreur utilisateurs:supprimer', error);
      throw error;
    }
  });
}
