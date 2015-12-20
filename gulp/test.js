var gulp = require('gulp');
var shell = require('gulp-shell');

/**
 * test
 * Runs the karma.js tests
 *
 * Dependency: 'build' task
 * @Author: Nathan Tranquilla
 */
gulp.task('test', ['build'], shell.task([
  'karma start'
]));