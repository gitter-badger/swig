/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const request = require('request');

/**
    @desc Test connection to grab the temp archive from your sandbox.  This is done to validate your credentials are correct
**/
module.exports = function(event, args){
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
};
