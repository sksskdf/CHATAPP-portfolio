const { app, BrowserWindow } = require("electron");
const path = require("path");

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

app.on("second-instance", (event, commandLine, workingDirectory) => {
  console.log("a");
});

app.whenReady().then(() => {
  let win = new BrowserWindow({
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  if (process.env.mode === "dev") {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:3000");
  } else {
    win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
  }

  win.once("ready-to-show", () => win.show());
  win.on("closed", () => {
    win = null;
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
