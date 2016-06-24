/* jslint node: true */
/* jshint esversion: 6 */
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');                  // compiles SASS
const prefixer = require('gulp-autoprefixer');      // css vendor prefixer
const sourcemaps = require('gulp-sourcemaps');      // generates source maps for debugging SASS in chrome console
const notify = require('gulp-notify');              // system tray notifications

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

gulp.task('default', ['sass', 'big-brother']);
