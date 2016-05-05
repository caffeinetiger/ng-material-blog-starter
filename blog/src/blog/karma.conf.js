'use strict';

module.exports = function (config) {

    var configuration = {
        autoWatch: false,
        files: [
            { pattern: 'tests.config.js', watched: false, included: true, served: true },
        ],
        frameworks: ['jasmine'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'tmp/serve/',
            moduleName: 'gulpAngular'
        },

        //browsers: ['PhantomJS'],
        //browsers: ['Chrome'],
        browsers: ['IE'],

        plugins: [
          'karma-phantomjs-launcher',
          'karma-chrome-launcher',
          'karma-ie-launcher',
          'karma-jasmine',
          'karma-ng-html2js-preprocessor'
        ],

        preprocessors: {
            'tmp/serve/**/*.html': ['ng-html2js']
        }
    };

    // This block is needed to execute Chrome on Travis
    // If you ever plan to use Chrome and Travis, you can keep it
    // If not, you can safely remove it
    // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
    if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
        configuration.customLaunchers = {
            'chrome-travis-ci': {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        };
        configuration.browsers = ['chrome-travis-ci'];
    }

    config.set(configuration);
};
