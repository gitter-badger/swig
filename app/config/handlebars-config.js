/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const hbs = require('handlebars');      // handlebars templating
const fs = require('fs');               // NodeJS file system package

module.exports = {
    /**
        @desc takes a string of hbs markup and the data that needs compiled together and returns the compiled output
        
        @param {String} source - this is the source the hbs template.  Most likely you will retrieve this with a require statement.
        @param {Object} data - this is the data needed to compile your template
    **/
    render : function(source, data){
        let template = hbs.compile(source);
        return template(data);
    }
};
