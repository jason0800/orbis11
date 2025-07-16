const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFile: (path) => ipcRenderer.invoke('open-item', path),
  scanFolder: (path) => ipcRenderer.invoke('scan-folder', path),
  copyToClipboard: (path) => ipcRenderer.invoke('copy-to-clipboard', path)
})
