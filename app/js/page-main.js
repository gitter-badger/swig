/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

let ipc = window.require('ipc');

let testButton = document.querySelector('.app-events-test');

console.log(testButton);

testButton.addEventListener('click', function() {
    console.log('clicked');
    ipc.send('ipc-test-start');
});


ipc.on('ipc-test-response', (event, arg) => {
    console.log('Even more SCIENCE!');
});
