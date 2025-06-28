const { contextBridge, ipcRenderer } = require('electron');

console.log('Hello from preload!');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  selectFolder: () => ipcRenderer.invoke('select-folder')
})
