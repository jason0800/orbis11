const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  }
)

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.loadURL('http://localhost:5173/')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', () => {
    const folderPath = dialog.showOpenDialogSync({properties: ['openDirectory']})[0]
    console.log(folderPath)
    
    const folderName = path.basename(folderPath)
    const filesInFolder = fs.readdirSync(folderPath)

    console.log("folderName: ", folderName)
    console.log("filesInFolder: ", filesInFolder)

    return { folderName, filesInFolder }
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