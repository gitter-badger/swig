/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

let fs = require('fs');

/**
    @desc retrieve a file from the filesystem using the FS package
**/
function getFile(file){
    try {
        return fs.readFileSync(`${global.appRoot}/app/views/${file}`, {
            encoding : 'utf8'
        });
    } catch(e) {
        console.error(`Could not find file ${file}\n${e}`);
        return '<div class="missing-template">Opps!  Something went screwey</div>';
    }
}

module.exports = {
    
    /**
        @param {Object} args
            @prop {String} name - the raw file to fetch in the views folder.  may contain subdirectories
            @prop {String} sender - IPC channel to respond to
    **/
    html : (event, args) => {
        let fileContents = getFile(args.name);
        
        event.sender.send(args.sender, fileContents);
    },
    
    hbs : (event, args) => {
        // do nothing
    }
};
