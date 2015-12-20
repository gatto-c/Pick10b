'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

/**
 * Recurse through through the gulp directory
 * and require gulp task files.
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./gulp/' + file);
  });

/**
 * default
 * Task to identify the default action
 * when running 'gulp'.
 * @Author: Nathan Tranquilla
 */
gulp.task('default',['build']);
