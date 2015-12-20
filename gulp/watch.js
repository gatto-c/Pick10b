var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

/**
 * watch:sass
 * Watches the SASS file and runs the 'sass'
 * task when changes have been made
 *
 * Dependency: 'build' task
 * @Author: Nathan Tranquilla
 */
gulp.task('watch:sass', ['build'],function () {
  watch('client/**/*.scss', batch(function (events, done) {
    gulp.start('sass', done);
  }));
});

/**
 * watch:ng
 * Watches the AngularJS code and runs the
 * 'default' task when changes have been made.
 *
 * Dependency: 'build' task
 * @Author: Nathan Tranquilla
 */
gulp.task('watch:ng', ['build'],function () {
  watch(['client/my-ng-files/**/*.ng.*.js','client/my-ng-files/**/*.ng.template.html'], batch(function (events, done) {
    gulp.start('default', done);
  }));
});

/**
 * watch
 * Task composed of other watch subtasks
 * @Author: Nathan Tranquilla
 */
gulp.task('watch',['watch:sass','watch:ng']);