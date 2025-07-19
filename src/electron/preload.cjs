const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFile: (dirPath) => ipcRenderer.invoke('open-item', dirPath),
  scanFolder: (dirPath) => ipcRenderer.invoke('scan-folder', dirPath),
  copyToClipboard: (dirPath) => ipcRenderer.invoke('copy-to-clipboard', dirPath),
  createFile: (dirPath, fileName) => ipcRenderer.invoke('create-file', dirPath, fileName),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
})
