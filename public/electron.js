const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
} = require("electron");
const isDev = require("electron-is-dev");
const createExpressServer = require("./server");
const { default: axios } = require("axios");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    resizable: false,
    icon: path.join(__dirname, "Bot_icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  //   mainWindow.loadURL("http://localhost:3000");
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `http://localhost:8080`);

  createExpressServer(() => {
    console.log("Express server is running.");
  });

  const template = [
    {
      label: "View",
      submenu: [
        {
          role: "reload",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  globalShortcut.register("CommandOrControl+Shift+I", () => {
    mainWindow.webContents.toggleDevTools();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Listen for messages from the renderer process
ipcMain.on("send-message-to-server", async (event, message) => {
  try {
    const response = await sendUserMessageToServer(message);
    event.reply("bot-reply", response);
  } catch (error) {
    console.error("Error sending message to server:", error.message);
  }
});

// Function to send user message to the server
async function sendUserMessageToServer(message) {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/ask",
      { message },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in sendUserMessageToServer:", error.message);
    throw error;
  }
}
