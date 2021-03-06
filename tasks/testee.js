var testee = require('../lib/testee');
var async = require('async');
var extend = require('util')._extend;
var _ = require('underscore');

module.exports = function(grunt) {
	grunt.registerMultiTask('testee', 'Run tests', function() {
		var done = this.async();

		var opts = this.options({
			urls: [],
			browsers: []
		});

		var workers = _.map(opts.browsers, function(browser) {
			var testeeOptions = _.extend({
				browser: browser
			}, _.omit(opts, 'browsers', 'urls'));

			return function(callback) {
				grunt.log.writeln('Running testee on ' + browser, testeeOptions);
				testee.test(opts.urls[0], testeeOptions, callback);
			}
		});

		async.series(workers, done);
	});
}