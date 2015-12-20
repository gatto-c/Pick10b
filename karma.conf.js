// Karma configuration
// Generated on Wed Aug 05 2015 10:06:13 GMT-0300 (ADT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'client/js/moment/moment.min.js',
      'client/js/angular-1.3.4/angular.min.js',
      'client/js/angular-1.3.4/angular-mocks.js',
      'client/js/lodash-3.10.1/lodash.js',
      'client/js/angular-1.3.4/angular-cookies.js',
      'client/js/ui-grid.js',
      'client/js/ui-bootstrap-0.13.0/ui-bootstrap-tpls-0.13.0.js',
      'client/js/angular-1.3.4/angular-route.js',
      'client/my-angular-all.js',
      'client/my-ng-files/**/*.spec.js',

      //fixtures
      'dummy-json/output/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html'],

    htmlReporter: {
      outputFile: 'test/unit_test_reports/efr_unit_tests.html',

      // Optional
      pageTitle: 'EFR Unit Tests',
      subPageTitle: 'EFR Application Unit Test Results'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
};
