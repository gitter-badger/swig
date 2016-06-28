/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const request = require('request');

module.exports = function(event, args){
    let file = `${global.appRoot}/sandbox.json`;
    
    fs.stat(file, (err, stats) => {
        if(process.env.NODE_ENV != 'production'){
            console.log('Creating sandbox.json file');
        }
        
        /**
            @desc this function will hit the logs for the specified instance.  If it gets a good response it will send
                a login request IPC to the renderer process.  If not it will send a failure
        **/
        function testConnection(){
            request({
                url : `https://${args.hostname}/on/demandware.servlet/webdav/Sites/Temp`,
                auth : {
                    user: args.username,
                    password: args.password
                },
                strictSSL : false
            }, (err, res, body) => {
                if(err) {
                    console.error(`ERROR : error in test connection for sandbox login\n${err}`);
                    event.sender.send('login-failure');
                } else {
                    event.sender.send('login-success');
                }
            });
        }
        
        if(err === null){
            fs.unlink(file);
            fs.appendFile(file, JSON.stringify(args), testConnection());
        } else if(err.code === 'ENOENT'){
            fs.appendFile(file, JSON.stringify(args), testConnection());
        } else {
            console.error(`ERROR : Can't create sandbox.json file\nMESSAGE : ${err.message}`);
            event.sender.send('login-failure');
        }
    });
};
