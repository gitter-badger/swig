/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {app, BrowserWindow} = require('electron');             // Module to control application life.
const fs = require('fs');

let win;  // window global to prevent termination on garbage collection

global.appRoot = __dirname;
global.userData = app.getPath('userData');

/** @desc creates a basic 800 x 600 window and pulls in the index.html file **/
function createWindow() {
    win = new BrowserWindow({
        width: 768,
        height: 1024,
        frame: true
    });
    
    win.maximize();
    
    fs.mkdirSync(`${global.userData}/logs-temp/`);
    
    win.loadURL(`file://${__dirname}/app/views/home.html`);

    if(process.env.NODE_ENV == 'dev'){
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        // terminate the window
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    
    // delete the log temp directory and all files contained within
    require('./app/config/delete-directory')(`${global.userData}/logs-temp/`);
    
    app.quit();
});

let routing = require('./app/config/routing')();
