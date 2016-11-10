/**
    @desc this is a utility function for deleting a directory and all of it's files.
    
    TODO : restructure for a recursive call that will delete files and subdirectories as well
**/

/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const fs = require('fs');

module.exports = function(path){
    if(fs.existsSync(path)){
        fs.readdirSync(path).forEach(function(file, index){
            fs.unlinkSync(path + file);
        });
        fs.rmdirSync(path);
    }
};
