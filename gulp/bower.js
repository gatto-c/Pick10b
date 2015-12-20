var fs = require('fs');
var gulp = require('gulp');
var bower = require('gulp-bower');

/**
 * bower:js
 * Installs js dependencies for the client
 * @Author Nathan Tranquilla
 */
gulp.task('bower:js', function(){
  return bowerInstall('client/js');
});

/**
 * bower:font
 * Installs font dependencies for the client
 * @Author Nathan Tranquilla
 */
gulp.task('bower:font', function(){
  return bowerInstall('client/font');
});

/**
 * bower:fonts
 * Installs fonts dependencies for the client
 * @Author Nathan Tranquilla
 */
gulp.task('bower:fonts', function(){
  return bowerInstall('client/fonts');
});

/**
 * bower
 * Installs all bower_components for the client
 * @Author Nathan Tranquilla
 */
gulp.task('bower',['bower:js','bower:font','bower:fonts']);

function bowerInstall(cwd){
  var bowerFile = cwd + '/bower.json';
  if (!fs.existsSync(bowerFile)){
    console.log(bowerFile+' does not exist');
    return;
  }
  return bower({cwd:cwd});
}