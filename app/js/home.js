/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {ipcRenderer} = require('electron');

let testButton = document.querySelector('.app-events-test');

console.log(testButton);

testButton.addEventListener('click', function() {
    console.log('clicked');
    ipcRenderer.send('ipc-test-start');
});


ipcRenderer.on('ipc-test-reply', (event, arg) => {
    console.log('Even more SCIENCE!');
});
