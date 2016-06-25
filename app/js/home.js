/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {ipcRenderer} = require('electron');
const $ = require('../js/jquery.js');

let home = {};

// preserving as vanilla javascript for reference
let exitApp = document.querySelector('#app-exit');

exitApp.addEventListener('click', () => {
    ipcRenderer.send('app-exit');
});


});
