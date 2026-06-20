import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  categories: {
    liste: () => ipcRenderer.invoke('categories:liste'),
    detail: (id: number) => ipcRenderer.invoke('categories:detail', id),
    creer: (data: unknown) => ipcRenderer.invoke('categories:creer', data),
    modifier: (id: number, data: unknown) => ipcRenderer.invoke('categories:modifier', id, data),
    supprimer: (id: number) => ipcRenderer.invoke('categories:supprimer', id),
  },

  produits: {
    liste: () => ipcRenderer.invoke('produits:liste'),
    detail: (id: number) => ipcRenderer.invoke('produits:detail', id),
    creer: (data: unknown) => ipcRenderer.invoke('produits:creer', data),
    modifier: (id: number, data: unknown) => ipcRenderer.invoke('produits:modifier', id, data),
    supprimer: (id: number) => ipcRenderer.invoke('produits:supprimer', id),
  },

  clients: {
    liste: () => ipcRenderer.invoke('clients:liste'),
    detail: (id: number) => ipcRenderer.invoke('clients:detail', id),
    creer: (data: unknown) => ipcRenderer.invoke('clients:creer', data),
    modifier: (id: number, data: unknown) => ipcRenderer.invoke('clients:modifier', id, data),
    supprimer: (id: number) => ipcRenderer.invoke('clients:supprimer', id),
  },

  commandes: {
    liste: () => ipcRenderer.invoke('commandes:liste'),
    detail: (id: number) => ipcRenderer.invoke('commandes:detail', id),
    creer: (data: unknown) => ipcRenderer.invoke('commandes:creer', data),
    modifier: (id: number, data: unknown) => ipcRenderer.invoke('commandes:modifier', id, data),
    supprimer: (id: number) => ipcRenderer.invoke('commandes:supprimer', id),
  },

  supplements: {
    liste: () => ipcRenderer.invoke('supplements:liste'),
    detail: (id: number) => ipcRenderer.invoke('supplements:detail', id),
    creer: (data: unknown) => ipcRenderer.invoke('supplements:creer', data),
    modifier: (id: number, data: unknown) => ipcRenderer.invoke('supplements:modifier', id, data),
    supprimer: (id: number) => ipcRenderer.invoke('supplements:supprimer', id),
  },

  utilisateurs: {
    liste: () => ipcRenderer.invoke('utilisateurs:liste'),
    detail: (id: number) => ipcRenderer.invoke('utilisateurs:detail', id),
    creer: (data: unknown) => ipcRenderer.invoke('utilisateurs:creer', data),
    modifier: (id: number, data: unknown) => ipcRenderer.invoke('utilisateurs:modifier', id, data),
    supprimer: (id: number) => ipcRenderer.invoke('utilisateurs:supprimer', id),
  },

  statistiques: {
    compteurs: () => ipcRenderer.invoke('statistiques:compteurs'),
    chiffreAffaires: () => ipcRenderer.invoke('statistiques:chiffre-affaires'),
  },
});
