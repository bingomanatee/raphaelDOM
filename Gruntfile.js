module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/index.js', 'src/Box.js', 'src/Measure.js', 'src/rect.js'],
				dest: 'build/raphaelDOM.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			         mangle: false,
			         beautify: true,
			         compress: false
			},
			build: {
			       files: [
				       {	src: 'build/raphaelDOM.js',
					       dest: 'index.js'},
				       {
					       src: 'build/raphaelDOM.js',
					       dest: 'testServer/public/js/raphaelDOM.js'
				       }
			       ]

			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'uglify']);

};