const { app, BrowserWindow, ipcMain, shell} = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');
const { createRequire } = require('module');

const keytar = require('keytar');

// Define the createWindow function
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    frame: false,
  });

  mainWindow.loadURL('http://localhost:3000');

  // Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log(`Prevented opening new window: ${url}`);
    return { action: 'deny' };
  });

  // Prevent navigation from middle-clicks
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (event.button === 1) {
      console.log('Middle click navigation prevented');
      event.preventDefault();
    }
  });

  // Listen for fullscreen window request
  ipcMain.on('fullscreen-window', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.setFullScreen(true);
    }
  });

  // Listen for minimize window request
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  // Listen for close window request
  ipcMain.on('close-window', () => {
    mainWindow.close();
  });

 // Save login data after successful login
ipcMain.on('save-login-data', async (event, { email, password }) => {
  try {
    await keytar.setPassword('TalkToMe', email, password);
    console.log("Login data saved!");
    event.reply('login-data-saved');
  } catch (error) {
    console.error('Error saving login data:', error);
    event.reply('login-data-save-error', error.message);
  }
});

// Retrieve user data when needed
ipcMain.on('get-current-user', async (event) => {
  try {
    const email = await getStoredEmail(); // Implement this function to retrieve the email
    event.reply('current-user', email);
  } catch (error) {
    console.error('Error retrieving current user:', error);
    event.reply('current-user-error', error.message);
  }
});

// A helper function to get stored email
async function getStoredEmail() {
  const accounts = await keytar.findCredentials('TalkToMe');
  return accounts.length > 0 ? accounts[0].account : null;
}

// Retrieve login data when needed
ipcMain.on('get-login-data', async (event, email) => {
  try {
    const password = await keytar.getPassword('TalkToMe', email);
    event.reply('send-login-data', { email, password });
  } catch (error) {
    console.error('Error retrieving login data:', error);
    event.reply('login-data-retrieve-error', error.message);
  }
});

// Function to clear stored login data
const clearLoginData = async () => {
  try {
    await keytar.deletePassword('TalkToMe', 'email'); 
    await keytar.deletePassword('TalkToMe', 'password');
  } catch (error) {
    console.error('Error clearing login data:', error);
  }
};

// Handle logout request from renderer process
// Clear login data when user logs out
ipcMain.on('logout', async (event) => {
  try {
    const accounts = await keytar.findCredentials('TalkToMe');
    for (const account of accounts) {
      await keytar.deletePassword('TalkToMe', account.account);
    }
    event.reply('logout-success');
  } catch (error) {
    console.error('Error during logout:', error);
    event.reply('logout-error', error.message);
  }
});

}

// Register 'ready' event handler
app.on('ready', createWindow);

// Register 'window-all-closed' event handler
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Register 'activate' event handler
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
