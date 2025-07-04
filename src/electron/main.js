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

  console.log(globalThis.process.env.NODE_ENV)

  if (isDev()) {
    win.loadURL("http://localhost:520/")
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist-react/index.html'))
  }
  win.webContents.openDevTools()
}

const scanDirectory = (dirPath, parentId, result = []) => {

    const contents = fs.readdirSync(dirPath)
    console.log("CALLING SCANDIRECTORY ON: ", dirPath)
    console.log("parentId is:" , parentId)
    
    contents.forEach(item => {
      const itemPath = path.join(dirPath, item)
      const stats = fs.statSync(itemPath)
      const itemId = uuidv4().substring(20)

      result.push({
          id: itemId,
          parentId: parentId,
          name: path.basename(itemPath)
      })

      console.log("RESULT: ", result)
      
      if (stats.isDirectory()) {
          scanDirectory(itemPath, itemId, result)
      }
    })

    console.log("RETURNING FROM: ", dirPath)
    return result
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', () => {
    const folderPath = dialog.showOpenDialogSync({properties: ['openDirectory']})[0]
    console.log("folderPath: ", folderPath)

    const strata = [ { id: "root", name: path.basename(folderPath) } ]
    const everything = strata.concat(scanDirectory(folderPath, "root"))
    console.log("\n\n EVERYTHING: ", everything)

    return everything
  })

  createWindow()
})

console.log(globalThis)

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