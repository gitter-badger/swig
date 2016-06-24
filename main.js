/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const electron = require('electron');

const {app} = electron;             // Module to control application life.
const {BrowserWindow} = electron;   // Module to create native browser window.

let win;                            // window global to prevent termination on garbage collection

/** @desc creates a basic 800 x 600 window and pulls in the index.html file **/
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true
    });
    
    win.loadURL(`file://${__dirname}/app/views/main.html`);

    if(process.env.NODE_ENV != 'production'){
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        // terminate the window
        win = null;
    });
}

app.on('ready', createWindow);

var routings = require('./app/controllers/routing');
