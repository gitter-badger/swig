/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {app, BrowserWindow} = require('electron');             // Module to control application life.

let win;                            // window global to prevent termination on garbage collection

/** @desc creates a basic 800 x 600 window and pulls in the index.html file **/
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true
    });
    
    win.loadURL(`file://${__dirname}/app/views/home.html`);

    if(process.env.NODE_ENV != 'production'){
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        // terminate the window
        win = null;
    });
}

app.on('ready', createWindow);

let routing = require('./app/config/routing')();
