import { app, BrowserWindow, ipcMain, dialog, shell, clipboard} from 'electron';
import fs from 'fs';
import path from 'path';
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

  ipcMain.handle('open-item', async (event, dirPath) => {
    try {
      const result = await shell.openPath(dirPath);
      if (result) {
        console.error('Error opening file:', result);
      }
    } catch (err) {
      console.error('Failed to open file:', err);
    }
  });

  ipcMain.handle('scan-folder', async (event, dirPath) => {
    return scanFolder(dirPath)
  })

  ipcMain.handle('copy-to-clipboard', (event, dirPath) => {
    console.log(typeof dirPath)
    clipboard.writeText(dirPath)
  })

  ipcMain.handle('create-file', (event, dirPath) => {
    console.log("in create-file, path: ", dirPath)
    const fileToWrite = path.join(dirPath, "test.txt")
    
    fs.writeFile(fileToWrite, "", err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });
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