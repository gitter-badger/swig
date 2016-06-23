/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const electron = require('electron');

const {app} = electron;             // Module to control application life.
const {BrowserWindow} = electron;   // Module to create native browser window.

let win;                            // window global to prevent termination on garbage collection

/** @desc creates a basic 800 x 600 window and pulls in the index.html file **/
function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    
    win.loadURL(`file://${__dirname}/index.html`);

    if(process.env.NODE_ENV != 'production'){
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        // terminate the window
        win = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
