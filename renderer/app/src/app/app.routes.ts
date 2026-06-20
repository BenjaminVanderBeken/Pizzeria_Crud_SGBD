import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { ProduitsPage } from './pages/produits-page/produits-page';
import { ClientsPage } from './pages/clients-page/clients-page';
import { CommandesPage } from './pages/commandes-page/commandes-page';
import { SupplementsPage } from './pages/supplements-page/supplements-page';

export const routes: Routes = [
  { path: '', component: DashboardPage, title: 'Vue d ensemble' },
  { path: 'categories', component: CategoriesPage, title: 'Categories' },
  { path: 'produits', component: ProduitsPage, title: 'Produits' },
  { path: 'clients', component: ClientsPage, title: 'Clients' },
  { path: 'commandes', component: CommandesPage, title: 'Commandes' },
  { path: 'supplements', component: SupplementsPage, title: 'Supplements' },
  { path: '**', redirectTo: '' },
];
