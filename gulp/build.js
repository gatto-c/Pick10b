var gulp = require('gulp');
var rimraf = require('rimraf');
var iife = require("gulp-iife");
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var eslint = require('gulp-eslint');
var size = require('gulp-size');

/**
 * ng-templates
 * Assembles all the html templates and
 * caches them using angular's template cache
 *
 * @Author: Nathan Tranquilla
 */
gulp.task('ng-templates', function () {
  return gulp.src('client/my-ng-files/**/*.ng.template.html')
    .pipe(templateCache( {
      module: "myPick10",
      filename: 'gulp.ng.template.js'
    }))
    .pipe(gulp.dest('build/client'));
});

/**
 * assemble-files
 * Assembles all the ng files and concatenates them
 * into a singular file.
 *
 * Dependency: 'ng-templates' task
 * @Author: Nathan Tranquilla
 */
gulp.task('assemble-files',['ng-templates'],function(){
  return gulp.src([
      'client/my-ng-files/**/*.ng.application.js',
      'client/my-ng-files/**/*.ng.constant.js',
      'client/my-ng-files/**/*.ng.config.js',
      'client/my-ng-files/**/*.ng.application.factory.js',
      'client/my-ng-files/**/*.ng.provider.js',
      'client/my-ng-files/**/*.proxy.ng.factory.js',
      'client/my-ng-files/**/*.ng.factory.js',
      'client/my-ng-files/**/*.ng.filter.js',
      'client/my-ng-files/**/*.ng.service.js',
      'client/my-ng-files/**/*.ng.controller.js',
      'build/client/**/*.ng.template.js',
      'client/my-ng-files/**/*.ng.directive.js'])
    .pipe(iife())
    .pipe(concat('my-angular-all.js'))
    .pipe(gulp.dest('client'));
});

/**
 * clean
 * Forcefully removes the 'build' folder.
 *
 * Dependency: 'assemble-files' task
 * @Author: Nathan Tranquilla
 */
gulp.task('clean', ['assemble-files'], function (cb) {
  rimraf('build', cb);
});

/**
 * sass
 * Runs SASS. Logs any errors if any
 * occur.
 * @Author: Nathan Tranquilla
 */
gulp.task('sass', function () {
  gulp.src('./client/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client'));
});

/**
 * lint
 * Runs eslint and reports errors/warnings in code base
 */
gulp.task('lint', function() {
  return gulp.src('client/my-ng-files/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(size());
});

/**
 * build
 * Task composed of all tasks required to
 * consider the project built.
 * @Author: Nathan Tranquilla
 */
gulp.task('build',['ng-templates','assemble-files','clean','sass', 'lint']);