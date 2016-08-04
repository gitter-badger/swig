/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const parser = require('parse5');
const app = require('electron');


/**
    @constructor for creating custom exception outputs
**/
function CreateException(name, message){
    this.name = name;
    this.message = message;
}

/**
    @desc this was pulled from the demandware plugin dwlogs and parses through a response body in order to make a list of log files
    
    @param {String} response - this is the response body from the demandware instance containing a list of log files
**/
function getFiles(response){
    let document = parser.parse(response);
    let html = _.find(document.childNodes, {nodeName: 'html'});
    let body = _.find(html.childNodes, {nodeName: 'body'});
    let table = _.find(body.childNodes, {nodeName: 'table'});
    let tbody = _.find(table.childNodes, {nodeName: 'tbody'});
    let fileRows = tbody.childNodes;
    
    return fileRows.reduce(function (files, child, index) {
		// skip the first row (title)
		// only consider tr elements
		if (child.nodeName === 'tr' && index !== 0) {
			files.push(parseFileRow(child));
		}
		return files;
	}, []);
}

/**
    @desc make a request to the sandbox instance for a list of logs and pass them into the file handler function
    
    @param {Object} credentials - demandware instance credentials
    @param {Object} event - this is the IPC event that will be used to respond back to the renderer process
**/
function getLogs(credentials, event){
    function handleFiles(err, inc, response){
        if(err){
            console.error(`Bad Response to Get Logs Request : ${err}`);
        }
        
        let files = getFiles(response);
        
        event.sender.send('get-logs-response', files);
    }
    
    try {
        request({
            url : `https://${credentials.hostname}/on/demandware.servlet/webdav/Sites/Logs`,
            auth : {
                user: credentials.username,
                password: credentials.password
            },
            strictSSL : false
        }, handleFiles);
    } catch(e){
        console.error(`${e.name} : ${e.message}`);
    }
}

/**
    @desc fetches a log file from the target instanced
    
    @param {Object} credentials - demandware instance credentials
    @param {Object} event - this is the IPC event that will be used to respond back to the renderer process
    @param {Object} log - details about the log file to retrieve
**/
function getLog(credentials, event, log){
    request({
        url : `https://${credentials.hostname}/on/demandware.servlet/webdav/Sites/Logs/${log.name}`,
        auth : {
            user : credentials.username,
            password : credentials.password
        },
        strictSSL : false
    }, (err, inc, response) => {
        if(err) {
            console.error(`Error retrieving log file : ${err}`);
        }
        
        try {
            let stats = fs.statSync(`${global.userData}/logs-temp/${log.name}`);
            let file = fs.readFileSync(`${global.userData}/logs-temp/${log.name}`);
            let delta = response.replace(file, '');
            response = `${file}{!TAIL}${delta}`;
        } catch(e){
            fs.writeFileSync(`${global.userData}/logs-temp/${log.name}`, response);
        }
        
        event.sender.send('get-log-file', response);
    });
}

/**
    @desc creates an empty file in AppData and pushes this to your sandbox so that it will reset your current log file to a default empty state
**/
function clearLog(credentials, event, log){
    let appData = global.userData;
    
    fs.writeFileSync(`${appData}\\${log.name}`, '');
    
    fs.createReadStream(`${appData}\\${log.name}`).pipe(
        request({
            url : `https://${credentials.hostname}/on/demandware.servlet/webdav/Sites/Logs/${log.name}`,
            auth : {
                user : credentials.username,
                password : credentials.password
            },
            strictSSL : false,
            method : 'PUT'
        }, (err, res, body) => {
            if(err){
                console.error(`ERROR: file transfer failed with the following...\n ${err.message}`);
                process.exit(1);
            } else if(res.statusCode >= 400){
                console.error(`ERROR: server responded with status code ${res.statusCode}`);
                
                if(res.statusCode === 401){
                    // TODO : Prompt user if they would like to launch the sandbox.json creation script
                    console.error('A 401:Unauthorized response might indicate bad credentials');
                }
            }
        })
    );
    
    fs.unlinkSync(`${appData}\\${log.name}`);
    
    event.sender.send('reset-log-file');
}

/**
    @desc used to parse a row of markup and output an object containing the link, name, and modified date for a log file
**/
function parseFileRow(row){
    let tds = _.filter(row.childNodes, {nodeName: 'td'});
    let fileLink = _.find(tds[0].childNodes, {nodeName: 'a'});
    let fileModified = _.find(tds[2].childNodes, {nodeName: 'tt'});
    return {
        href: _.find(fileLink.attrs, {name: 'href'}).value,
		name: _.find(fileLink.childNodes, {nodeName: 'tt'}).childNodes[0].value,
		lastModified: fileModified.childNodes[0].value
    };
}

module.exports = {
    /**
        @desc get a list of all logs on the demandware instance
    **/
    getLogList : function(event, args){
        getLogs(args, event);
    },
    
    /**
        @desc fetch the contents of a single log file on a demandware instance
    **/
    fetchLogFile : function(event, args){
        getLog(args.creds, event, args.log);
    },
    
    /**
        @desc send an empty file with the same name as a current file to reset it to a neutral state
    **/
    clearLogFile : function(event, args){
        clearLog(args.creds, event, args.log);
    }
};
