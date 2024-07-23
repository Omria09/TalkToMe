const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
  },
  keytar: require('keytar'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  fullScreenWindow: () => ipcRenderer.send('fullscreen-window')
});

contextBridge.exposeInMainWorld('electronAPI', {
  // saveUserData: (userData) => ipcRenderer.invoke('save-user-data', userData),
  getUserData: () => ipcRenderer.invoke('get-user-data'),
  deleteUserData: () => ipcRenderer.invoke('delete-user-data')
});
