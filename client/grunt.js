module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : '<json:../package.json>',
		meta : {
			banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		concat : {
			dist : {
				src : [
					/*'<banner:meta.banner>', */
					'lib/underscore.js',
					'adapters/mocha.js',
					'adapters/qunit.js',
					'adapters/jasmine.js'
				],
				dest : 'dist/<%= pkg.name %>.js'
			}
		},
		min : {
			dist : {
				src : [ /* '<banner:meta.banner>', */ '<config:concat.dist.dest>' ],
				dest : 'dist/<%= pkg.name %>.min.js'
			}
		},
		lint : {
			files : ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		jshint : {
			options : {
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				browser : true
			},
			globals : {
				jQuery : true
			}
		},
		watch: {
			files: '<config:concat.dist.src>',
			tasks: 'concat min'
		},
		uglify : {}
	});

	// Default task.
	grunt.registerTask('default', 'concat min');
};