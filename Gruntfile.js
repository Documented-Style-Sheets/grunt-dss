/*
 * Grunt DSS - Build Plugin
 * https://github.com/darcyclarke/grunt-dss
 *
 * Copyright (c) 2014 Darcy Clarke
 * Licensed under the MIT license.
 * https://github.com/darcyclarke/grunt-dss/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any files, remove the docs folder
    clean: {
      tests: ['docs']
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

  });

  // Load NPM Tasks
  grunt.loadTasks('tasks');

  // Plugins that provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the test task is run, cleanup the docs folder and
  // then test the result.
  grunt.registerTask('test', ['clean', 'nodeunit']);

  // By default run the DSS task to create docs
  grunt.registerTask('default', ['clean', 'dss']);

};
