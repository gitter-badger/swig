/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const request = require('request');

function CreateException(name, message){
    this.name = name;
    this.message = message;
}

function getLogs(credentials){
    try {
        request({
            url : `https://${credentials.hostname}/on/demandware.servlet/webdav/Sites/Logs`,
            auth : {
                user: credentials.username,
                password: credentials.password
            },
            strictSSL : false
        }, (err, res, body) => {
            if(err) {
                throw new CreateException('Bad Response to Get Logs Request', err.message);
            }
            
            console.log(body);
        });
    } catch(e){
        console.error(`${e.name} : ${e.message}`);
    }
}

module.exports = function(event, args){
    let file = `${global.appRoot}/sandbox.json`;
    
    try {
        fs.stat(file, (err, stats) => {
            if(err === null){
                fs.readFile(file, (err, data) => {
                    if(err) {
                        throw new CreateException('File Read Error', 'Could not read sandbox.json');
                    }
                    
                    getLogs(JSON.parse(data));
                });
            } else {
                throw new CreateException('File Access Error', 'Could not access the sandbox.json file');
            }
        });
    } catch(e) {
        console.error(`${e.name} : ${e.message}`);
        // TODO : sender bad status IPC to renderer process
    }
};
