import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { closePrisma } from './database/prisma';
import { enregistrerIpc } from './ipc';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    title: 'GESTION PIZZERIA',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(
    path.join(__dirname, '..', '..', 'renderer/app/dist/app/browser/index.html'),
  );

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  enregistrerIpc();

  createWindow();
});

app.on('before-quit', async () => {
  await closePrisma();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
