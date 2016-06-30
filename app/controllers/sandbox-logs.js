/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const parser = require('parse5');

/**
    @constructor for creating custom exception outputs
**/
function CreateException(name, message){
    this.name = name;
    this.message = message;
}

/**
    @desc get credentials from the sandbox.json file
**/
function getCredentials(){
    let credentials = `${global.appRoot}/sandbox.json`;
    
    try {
        let fileStat = fs.statSync(credentials);
        
        if(fileStat.isFile()){
            let file = fs.readFileSync(credentials);
            
            return file;
        } else {
            throw new CreateException('File Access Error', 'Could not find sandbox.json');
        }
    } catch(e){
        console.error(`${e.name} : ${e.message}}`);
        // TODO : send bad status IPC to renderer process
    }
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
    
    @param {Object} credentials - this is the include from the sandbox.json file containing your login credentials
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

**/
function getLog(credentials, event, log){
    console.log(credentials);
    
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
        
        event.sender.send('get-log-file', response);
    });
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
        let credentials = getCredentials();
        
        getLogs(JSON.parse(credentials), event);
    },
    
    /**
        @desc fetch the contents of a single log file on a demandware instance
    **/
    fetchLogFile : function(event, log){
        let credentials = getCredentials();
        
        getLog(JSON.parse(credentials), event, log);
    }
};
