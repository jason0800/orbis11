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

const scanDirectory = (dirPath, parentId, result = []) => {
    const contents = fs.readdirSync(dirPath)
    
    contents.forEach(item => {
      const itemPath = path.join(dirPath, item)
      const stats = fs.statSync(itemPath)
      const itemId = uuidv4().substring(20)

      result.push({
          id: itemId,
          parentId: parentId,
          name: path.basename(itemPath)
      })
      
      if (stats.isDirectory()) {
          scanDirectory(itemPath, itemId, result)
      }
    })
    return result
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', () => {
    const folderPathArr = dialog.showOpenDialogSync({properties: ['openDirectory']})
    console.log("folderPathArr: ", folderPathArr)

    if (folderPathArr) {
      const folderPath = folderPathArr[0]
      const rootNode = [ { id: "root", name: path.basename(folderPath) } ]
      const hierarchy = rootNode.concat(scanDirectory(folderPath, "root"))
      return hierarchy
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