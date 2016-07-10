/**
    This is the primary router for the inter-process communications.  These are
    all the active listeners available to the renderer process
**/

/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {app, ipcMain} = require('electron');
const logController = require('../controllers/sandbox-logs');

module.exports = () => {
    ipcMain.on('app-exit', (event, args) => {
        app.quit();
    });
    
    ipcMain.on('app-sandbox-login', (event, args) => {
        require('../controllers/sandbox-login')(event, args);
    });
    
    ipcMain.on('home-get-logs', logController.getLogList);
    ipcMain.on('home-get-log', logController.fetchLogFile);
    ipcMain.on('home-clear-log-file', logController.clearLogFile);
};
