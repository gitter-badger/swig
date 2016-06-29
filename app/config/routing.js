/**
    This is the primary router for the inter-process communications.  These are
    all the active listeners available to the renderer process
**/

/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {app, ipcMain} = require('electron');

module.exports = () => {
    ipcMain.on('app-exit', (event, args) => {
        app.quit();
    });
    
    ipcMain.on('app-sandbox-login', (event, args) => {
        require('../controllers/sandbox-login')(event, args);
    });
    
    ipcMain.on('ipc-test-start', (event, arg) => {
        console.log('You have done science!');
        event.sender.send('ipc-test-reply');
    });
    
    ipcMain.on('app-get-logs', (event, arg) => {
        require('../controllers/sandbox-logs').getLogList(event, arg);
    });
    });
};
