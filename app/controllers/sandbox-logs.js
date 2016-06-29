/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const parser = require('parse5');

function CreateException(name, message){
    this.name = name;
    this.message = message;
}

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
    getLogList : function(event, args){
        let file = `${global.appRoot}/sandbox.json`;
        
        try {
            fs.stat(file, (err, stats) => {
                if(err === null){
                    fs.readFile(file, (err, data) => {
                        if(err) {
                            throw new CreateException('File Read Error', 'Could not read sandbox.json');
                        }
                        
                        getLogs(JSON.parse(data), event);
                    });
                } else {
                    throw new CreateException('File Access Error', 'Could not access the sandbox.json file');
                }
            });
        } catch(e) {
            console.error(`${e.name} : ${e.message}`);
            // TODO : sender bad status IPC to renderer process
        }
    },
    
    fetchLogFile : function(event,args){

    }
};
