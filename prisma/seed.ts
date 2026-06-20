import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/prisma/generated/client.js';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./pizzeria.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Nettoyage de la base...');
  await prisma.detailSupplement.deleteMany();
  await prisma.detailCommande.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.produit.deleteMany();
  await prisma.supplement.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.client.deleteMany();
  await prisma.utilisateur.deleteMany();

  console.log('Creation des categories...');
  const pizzas = await prisma.categorie.create({
    data: { nom: 'Pizzas', description: 'Pizzas classiques et speciales', ordreAffichage: 1 },
  });
  const boissons = await prisma.categorie.create({
    data: { nom: 'Boissons', description: 'Boissons fraiches et chaudes', ordreAffichage: 2 },
  });
  const desserts = await prisma.categorie.create({
    data: { nom: 'Desserts', description: 'Desserts maison', ordreAffichage: 3 },
  });
  const entrees = await prisma.categorie.create({
    data: { nom: 'Entrees', description: 'Entrees et antipasti', ordreAffichage: 4 },
  });

  console.log('Creation des produits...');
  const margherita = await prisma.produit.create({
    data: { nom: 'Margherita', prixBase: 9.5, categorieId: pizzas.id, populaire: true, permetSupplement: true, description: 'Tomate, mozzarella, basilic' },
  });
  const quatreFromages = await prisma.produit.create({
    data: { nom: '4 Fromages', prixBase: 12.0, categorieId: pizzas.id, permetSupplement: true, description: 'Mozzarella, gorgonzola, parmesan, chevre' },
  });
  const regina = await prisma.produit.create({
    data: { nom: 'Regina', prixBase: 11.0, categorieId: pizzas.id, populaire: true, permetSupplement: true, description: 'Jambon, champignons, mozzarella' },
  });
  const calzone = await prisma.produit.create({
    data: { nom: 'Calzone', prixBase: 11.5, categorieId: pizzas.id, permetSupplement: true },
  });
  await prisma.produit.create({
    data: { nom: 'Coca-Cola', prixBase: 2.5, categorieId: boissons.id },
  });
  await prisma.produit.create({
    data: { nom: 'Eau minerale', prixBase: 1.5, categorieId: boissons.id },
  });
  await prisma.produit.create({
    data: { nom: 'Tiramisu', prixBase: 6.0, categorieId: desserts.id, populaire: true },
  });
  await prisma.produit.create({
    data: { nom: 'Panna Cotta', prixBase: 5.5, categorieId: desserts.id },
  });
  await prisma.produit.create({
    data: { nom: 'Bruschetta', prixBase: 5.0, categorieId: entrees.id },
  });
  await prisma.produit.create({
    data: { nom: 'Salade Caprese', prixBase: 7.0, categorieId: entrees.id },
  });

  console.log('Creation des supplements...');
  const mozzaSup = await prisma.supplement.create({
    data: { nom: 'Mozzarella', type: 'Fromage', prix: 1.5 },
  });
  const jambonSup = await prisma.supplement.create({
    data: { nom: 'Jambon', type: 'Viande', prix: 2.0 },
  });
  await prisma.supplement.create({
    data: { nom: 'Champignons', type: 'Legume', prix: 1.0 },
  });
  await prisma.supplement.create({
    data: { nom: 'Olives', type: 'Legume', prix: 1.0 },
  });
  await prisma.supplement.create({
    data: { nom: 'Pepperoni', type: 'Viande', prix: 2.0 },
  });

  console.log('Creation des clients...');
  const alice = await prisma.client.create({
    data: { nom: 'Dupont', prenom: 'Alice', email: 'alice@exemple.com', telephone: '0471000001' },
  });
  const bob = await prisma.client.create({
    data: { nom: 'Martin', prenom: 'Bob', email: 'bob@exemple.com', telephone: '0471000002' },
  });
  await prisma.client.create({
    data: { nom: 'Leroy', prenom: 'Claire', email: 'claire@exemple.com' },
  });

  console.log('Creation des commandes...');
  const cmd1 = await prisma.commande.create({
    data: {
      numeroCommande: 'CMD-001',
      clientId: alice.id,
      sousTotal: 21.0,
      montantTotal: 21.0,
      statut: 'TERMINEE',
      modePaiement: 'CARTE',
      details: {
        create: [
          { produitId: margherita.id, quantite: 1, prixUnitaire: 9.5, prixTotal: 9.5 },
          { produitId: quatreFromages.id, quantite: 1, prixUnitaire: 12.0, prixTotal: 12.0, notes: 'Sans gorgonzola' },
        ],
      },
    },
  });

  await prisma.commande.create({
    data: {
      numeroCommande: 'CMD-002',
      clientId: bob.id,
      sousTotal: 22.5,
      montantTotal: 22.5,
      statut: 'EN_PREPARATION',
      modePaiement: 'ESPECES',
      details: {
        create: [
          { produitId: regina.id, quantite: 1, prixUnitaire: 11.0, prixTotal: 11.0 },
          { produitId: calzone.id, quantite: 1, prixUnitaire: 11.5, prixTotal: 11.5 },
        ],
      },
    },
  });

  await prisma.commande.create({
    data: {
      numeroCommande: 'CMD-003',
      sousTotal: 9.5,
      montantTotal: 9.5,
      statut: 'EN_ATTENTE',
      modePaiement: 'EN_ATTENTE',
      details: {
        create: [
          { produitId: margherita.id, quantite: 1, prixUnitaire: 9.5, prixTotal: 9.5 },
        ],
      },
    },
  });

  // DetailSupplement : table de jonction N:M
  const detailCmd1 = await prisma.detailCommande.findFirst({
    where: { commandeId: cmd1.id, produitId: margherita.id },
  });

  if (detailCmd1) {
    await prisma.detailSupplement.create({
      data: {
        detailCommandeId: detailCmd1.id,
        supplementId: mozzaSup.id,
        quantite: 1,
        prix: mozzaSup.prix,
      },
    });
    await prisma.detailSupplement.create({
      data: {
        detailCommandeId: detailCmd1.id,
        supplementId: jambonSup.id,
        quantite: 1,
        prix: jambonSup.prix,
      },
    });
  }

  console.log('Creation des utilisateurs...');
  await prisma.utilisateur.create({
    data: { nom: 'Admin', prenom: 'Pierre', email: 'admin@pizzeria.com', passwordHash: 'hash_admin_123', role: 'ADMIN' },
  });
  await prisma.utilisateur.create({
    data: { nom: 'Caissier', prenom: 'Marie', email: 'marie@pizzeria.com', passwordHash: 'hash_marie_123', role: 'CAISSIER' },
  });

  console.log('Seed termine avec succes !');
}

main()
  .catch((e) => {
    console.error('Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
