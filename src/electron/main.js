import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from "node:path";
import { isDev, scanFolder } from './util.js';

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'src/electron/preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev()) {
    win.loadURL("http://localhost:520/")
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist-react/index.html'))
  }
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', () => {
    const folderPathArr = dialog.showOpenDialogSync({properties: ['openDirectory']})
    
    if (folderPathArr) {
      return scanFolder(folderPathArr[0])
    }
  })

  ipcMain.handle('open-item', async (event, path) => {
    try {
      const result = await shell.openPath(path);
      if (result) {
        console.error('Error opening file:', result);
      }
    } catch (err) {
      console.error('Failed to open file:', err);
    }
  });

  ipcMain.handle('scan-folder', async (event, path) => {
    return scanFolder(path)
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (globalThis.process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})