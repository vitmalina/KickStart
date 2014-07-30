var gulp        = require('gulp');
var concat      = require('gulp-concat');
var iconfont    = require('gulp-iconfont');
var jshint      = require('gulp-jshint');
var less        = require('gulp-less');
var prompt      = require('gulp-prompt');
var ssh         = require('gulp-ssh');
var uglify      = require('gulp-uglify');
var watch       = require('gulp-watch');

// not currently working
gulp.task('iconfont', function() {
    gulp.src(['app/icons/svg/*.svg'])
        .pipe(iconfont({
            fontName: 'icon-font',         // required
            appendCodepoints: true         // recommended option
        }))
        .on('codepoints', function(codepoints, options) {
            // CSS templating, e.g.
            console.log(codepoints, options);
        })
        .pipe(gulp.dest('app/icons/'));
});

gulp.task('default', function() {
    // place code for your default task here
});

// http://markgoodyear.com/2014/01/getting-started-with-gulp/