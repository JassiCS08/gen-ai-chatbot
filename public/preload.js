// preload.js

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("sendMessage", {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
});

contextBridge.exposeInMainWorld("receiveMessage", {
  receiveMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
