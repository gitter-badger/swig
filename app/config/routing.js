/**
    This is the primary router for the inter-process communications.  These are
    all the active listeners available to the renderer process
**/

/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {app, ipcMain} = require('electron');
const logController = require('../controllers/sandbox-logs');
const templates = require('../controllers/templates');

module.exports = () => {
    ipcMain.on('app-exit', (event, args) => {
        app.quit();
    });
    
    ipcMain.on('app-sandbox-login', (event, args) => {
        require('../controllers/sandbox-login')(event, args);
    });
    
    ipcMain.on('get-template-html', templates.html);
    ipcMain.on('get-template-hbs', templates.hbs);

    ipcMain.on('logs-get-logs', logController.getLogList);
    ipcMain.on('logs-get-log', logController.fetchLogFile);
    ipcMain.on('logs-clear-log-file', logController.clearLogFile);
};
