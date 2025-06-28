const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  }
)

  const isDev = !app.isPackaged;
  console.log(isDev)

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.loadURL('http://localhost:5173/')
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})