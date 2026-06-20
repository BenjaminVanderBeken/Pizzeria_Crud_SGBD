import { ipcMain } from 'electron';

import { compterCategories } from '../repositories/categorie.repository';
import { compterProduits } from '../repositories/produit.repository';
import { compterClients } from '../repositories/client.repository';
import { compterCommandes, calculerChiffreAffaires } from '../repositories/commande.repository';
import { compterSupplements } from '../repositories/supplement.repository';

export function enregistrerStatistiquesIpc(): void {
  ipcMain.handle('statistiques:compteurs', async () => {
    try {
      const [categories, produits, clients, commandes, supplements] = await Promise.all([
        compterCategories(),
        compterProduits(),
        compterClients(),
        compterCommandes(),
        compterSupplements(),
      ]);

      return { categories, produits, clients, commandes, supplements };
    } catch (error) {
      console.error('Erreur statistiques:compteurs', error);
      throw error;
    }
  });

  ipcMain.handle('statistiques:chiffre-affaires', async () => {
    try {
      const resultat = await calculerChiffreAffaires();
      return resultat._sum.montantTotal ?? 0;
    } catch (error) {
      console.error('Erreur statistiques:chiffre-affaires', error);
      throw error;
    }
  });
}
