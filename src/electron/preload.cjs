const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
})
