/* jslint node: true */
/* jshint esversion: 6 */
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');                  // compiles SASS
const prefixer = require('gulp-autoprefixer');      // css vendor prefixer
const sourcemaps = require('gulp-sourcemaps');      // generates source maps for debugging SASS in chrome console
const notify = require('gulp-notify');              // system tray notifications
const packager = require('electron-packager');      // utility for packaging electron apps for distribution
const fs = require('fs');

/**
    @desc copy a file and fire off a callback function or error or completion
    
    @param {String} source - source file to copy
    @param {String} target - where to copy the file to
    @param {Function} cb - callback function to invoke on error on after completion of copy
**/
function copyFile(source, target, cb){
    let cbCalled = false;
    
    function callback(err){
        if(!cbCalled){
            cb(err);
            cbCalled = true;
        }
    }
    
    let read = fs.createReadStream(source);
    let write = fs.createWriteStream(target);
    
    read.on('error', (err) => {
        callback(err);
    });
    
    write.on('error', (err) => {
        callback(err);
    });
    
    write.on('close', (err) => {
        cb();
    });
    
    read.pipe(write);
}

gulp.task('sass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', notify.onError({
            message : `Error : <%= error.message %>`,
            title: 'SASS Compiler Error'
        }))
        .pipe(prefixer({
            browsers : [
                'last 2 versions'
            ],
            cascade : false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('big-brother', () => {
    let watchers = {
        sass : gulp.watch('./src/scss/**/*.scss', ['sass']),
        logger : function(e){
            console.log(`File ${e.path} was ${e.type}, running tasks...`);
        }
    };
    
    watchers.sass.on('change', watchers.logger);
});

gulp.task('package', () => {
    let options = {
        arch : 'all',
        dir : './',
        platform : 'win32',
        asar : true,
        icon : 'swig.ico',
        name : 'swig',
        out : './releases/',
        version : '1.2.6',
        overwrite : true
    };
    
    packager(options, (err, appPaths) => {
        if(err){
            console.error(`Error during packaging: ${err}`);
        } else {
            // TODO rewrite copyFile to accept arrays so that I don't need to declare this four times
            // TODO this is throwing exceptions and I'm tired of staring at code for the day
            // copyFile('./swig.ico', './releases/swig-win32-ia32/');
            // copyFile('./swig.ico', './releases/swig-win32-x64/');
            // copyFile('./installer-script.nsi', './releases/swig-win32-ia32/');
            // copyFile('./installer-script.nsi', './releases/swig-win32-x64/');
        }
    });
});

gulp.task('release', ['sass'], () => {
    gulp.start('package');
});

gulp.task('default', ['sass', 'big-brother']);
