import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from "node:path";
import fs from "node:fs";
import { v4 as uuidv4 } from 'uuid';
import { isDev } from './util.js';

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

const scanFolders = (dirPath, parentId = null, folders = [], folderId = null) => {
  const contents = fs.readdirSync(dirPath)
  console.log("contents: ", contents)

  // Collect files in this directory
  const files = contents.filter(item => {
    const itemPath = path.join(dirPath, item);
    return fs.statSync(itemPath).isFile();
  });

  console.log("FILES: ", files)

  if (!folderId) { // if folderId is null, then generate one.
    folderId = "root"
  }

  const foldersInThisFolder = contents.filter((item) => {
    const itemPath = path.join(dirPath, item)
    return fs.statSync(itemPath).isDirectory()
  })

  if (foldersInThisFolder.length !== 0) {
    folders.push({
      id: folderId,
      parentId: parentId,
      name: path.basename(dirPath),
      files: files,
      isEndNode: false, // is not an end node if foldersInThisFolder not equal to 0
    })

    // continue recursive scan only if folder is not an end node
    contents.forEach(item => {    
      const itemPath = path.join(dirPath, item)
      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        const subFolderId = uuidv4().substring(20)
        scanFolders(itemPath, folderId, folders, subFolderId)
      }
    })
  } else {
    folders.push({
      id: folderId,
      parentId: parentId,
      name: path.basename(dirPath),
      files: files,
      isEndNode: true, // is an end node if foldersInThisFolder equal to 0
    })
  }
  return folders
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', () => {
    const folderPathArr = dialog.showOpenDialogSync({properties: ['openDirectory']})
    console.log("folderPathArr: ", folderPathArr)

    if (folderPathArr) {
      const folderPath = folderPathArr[0]
      return scanFolders(folderPath)
    }
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