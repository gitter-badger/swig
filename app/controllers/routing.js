/**
    This is the primary router for the inter-process communications.  These are
    all the active listeners available to the renderer process
**/

/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const ipc = require('electron');

module.exports = () => {
    ipc.on('ipc-test-start', (event, arg) => {
        console.log('You have done science!');
        event.sender.send('ipc-test-repy', 'science!');
    });
};
