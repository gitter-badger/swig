/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');

module.exports = function(event, args){
    let file = `${global.appRoot}/sandbox.json`;
    
    fs.stat(file, (err, stats) => {
        if(process.env.NODE_ENV != 'production'){
            console.log('Creating sandbox.json file');
        }
        
        if(err === null){
            fs.unlink(file);
            fs.appendFile(file, JSON.stringify(args));
            event.sender.send('login-success');
        } else if(err.code === 'ENOENT'){
            fs.appendFile(file, JSON.stringify(args));
            event.sender.send('login-success');
        } else {
            console.error(`ERROR : Can't create sandbox.json file\nMESSAGE : ${err.message}`);
            event.sender.send('login-failure');
        }
    });
};
