import { BrowserWindow, app, ipcMain, shell } from "electron";
import getPort, { portNumbers } from "get-port";
import * as path from "node:path";
import { spawn } from "node:child_process";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let webServerProcess: ReturnType<typeof spawn> | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 980,
    minHeight: 640,
    show: false,
    title: "MyApp",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}

async function waitForHttpOk(url: string, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function getPackagedWebRoot() {
  return path.join(process.resourcesPath, "web");
}

async function startPackagedNextServer() {
  const webRoot = getPackagedWebRoot();
  const serverJs = path.join(webRoot, "server.js");

  const port = await getPort({ port: portNumbers(3100, 3999) });
  const hostname = "127.0.0.1";

  webServerProcess = spawn(process.execPath, ["--run-as-node", serverJs], {
    cwd: webRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      HOSTNAME: hostname
    }
  });

  webServerProcess.once("exit", (code) => {
    if (!isDev && code && code !== 0) {
      app.quit();
    }
  });

  const url = `http://${hostname}:${port}`;
  await waitForHttpOk(url);
  return url;
}

async function loadApp(window: BrowserWindow) {
  if (isDev) {
    const devUrl = process.env.ELECTRON_START_URL ?? "http://localhost:3000";
    await window.loadURL(devUrl);
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  const url = await startPackagedNextServer();
  await window.loadURL(url);
}

function registerIpc() {
  ipcMain.handle("app:openExternal", async (_event, url: string) => {
    await shell.openExternal(url);
  });

  ipcMain.handle("window:minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.handle("window:maximize", () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });

  ipcMain.handle("window:close", () => {
    mainWindow?.close();
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (webServerProcess && !webServerProcess.killed) {
    webServerProcess.kill();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const win = createMainWindow();
    await loadApp(win);
  }
});

async function main() {
  registerIpc();
  await app.whenReady();
  const win = createMainWindow();
  await loadApp(win);
}

void main();
