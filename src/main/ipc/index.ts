import { enregistrerCategorieIpc } from './categorie.ipc';
import { enregistrerProduitIpc } from './produit.ipc';
import { enregistrerClientIpc } from './client.ipc';
import { enregistrerCommandeIpc } from './commande.ipc';
import { enregistrerSupplementIpc } from './supplement.ipc';
import { enregistrerUtilisateurIpc } from './utilisateur.ipc';
import { enregistrerStatistiquesIpc } from './statistiques.ipc';

export function enregistrerIpc(): void {
  enregistrerCategorieIpc();
  enregistrerProduitIpc();
  enregistrerClientIpc();
  enregistrerCommandeIpc();
  enregistrerSupplementIpc();
  enregistrerUtilisateurIpc();
  enregistrerStatistiquesIpc();
}
