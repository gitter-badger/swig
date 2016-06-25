/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {ipcRenderer} = require('electron');
const $ = require('../js/jquery.js');

let exitApp = document.querySelector('#app-exit');

exitApp.addEventListener('click', function() {
    ipcRenderer.send('app-exit');
});

/** test code **/

let testButton = document.querySelector('.app-events-test'); 

testButton.addEventListener('click', function() { 
    console.log('clicked'); 
    ipcRenderer.send('ipc-test-start'); 
}); 
 
 
ipcRenderer.on('ipc-test-reply', (event, arg) => { 
    console.log('Even more SCIENCE!'); 
});
