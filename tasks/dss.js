/*
 * Grunt DSS - Build Plugin
 * https://github.com/darcyclarke/grunt-dss
 *
 * Copyright (c) 2014 Darcy Clarke
 * Licensed under the MIT license.
 * https://github.com/darcyclarke/grunt-dss/LICENSE-MIT
 */

var Handlebars = require('handlebars');
var DSS = require('dss');

module.exports = function(grunt){

  // Register Task
  grunt.registerMultiTask('dss', 'Parse DSS comment blocks', function() {

    // Setup async promise
    var project = grunt.file.readJSON('package.json');
    var promise = this.async();
    var options = this.options({
      stylesheet: __dirname + '/styles.css',
      output_index: 'index.html',
      template_index: 'index.handlebars',
<<<<<<< Updated upstream
      output_index: 'index.html',
      include_empty_files: true
=======
      template_dir: __dirname + '/../template/'
>>>>>>> Stashed changes
    });

    // Verbose flags
    grunt.verbose.writeflags(options, 'Options');

    // Generate parsers from options
    for(var key in options.parsers) {
      DSS.parser(key, options.parsers[key]);
    }

    // Iterate over files
    this.files.forEach( function(file) {

      // Iterate files
      var files = file.src.filter(function(filepath) {

        // Warn on and remove invalid source files (if nonull was set).
        if(!grunt.file.exists(filepath)){
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }

        return true;

      });

      var template_dir        = options.template_dir;
      var output_dir          = file.dest;
      var template_filepath   = template_dir + options.template_index;
      var output_filepath     = output_dir + options.output_index;
      var length              = files.length;
      var styleguide          = [];
      var output_type         = 'created';
      var output              = null;

      // Parse File
      var parse_file = function(parsed) {

        var message = '• ' + grunt.log.wordlist([ filename ], { color: 'cyan' });
        grunt.verbose.writeln(message);

        parsed['stylesheet'] = grunt.options.stylesheet;
        parsed['file'] = filename;

<<<<<<< Updated upstream
          // Continue only if file contains DSS annotation
          if (options.include_empty_files || parsed.blocks.length) {
            // Add filename
            parsed['file'] = filename;

            // Add comment block to styleguide
            styleguide.push(parsed);
          }

          // Check if we're done
          if (length > 1) {
            length--;
          }
          else {
            // Set output template and file
            var template_filepath = template_dir + options.template_index,
                output_filepath = output_dir + options.output_index;
=======
        styleguide.push(parsed);

        if(length > 1) {
          length--;
        } else {
          generate_file();
        }
      };

      // Generate File
      var generate_file = function() {
>>>>>>> Stashed changes

        // Check template existence
        if (!grunt.file.exists(template_filepath)) {
          grunt.fail('Cannot read the template file');
        }

        // Copy template assets (except index.handlebars)
        var assets = grunt.file.expandMapping([ '**/*', '!' + options.template_index ], output_dir, { cwd: template_dir })
        assets.forEach(function(file) {
          file.src.forEach(function(src) {
            if (grunt.file.isDir(src)) {
              grunt.verbose.writeln('Creating ' + file.dest.cyan);
              grunt.file.mkdir(file.dest);
            } else {
              grunt.verbose.writeln('Copying ' + src.cyan + ' -> ' + file.dest.cyan);
              grunt.file.copy(src, file.dest);
            }
<<<<<<< Updated upstream
            // avoid write if there is no change
            if (output !== html) {
              // Render file
              grunt.file.write(output_filepath, html);
=======
          });
        });
>>>>>>> Stashed changes

        // Create HTML ouput
        var html = Handlebars.compile(grunt.file.read(template_filepath))({
          project: project,
          files: styleguide
        });

        // Overwrite
        if(grunt.file.exists(output_filepath)) {
          output_type = 'overwrited';
          output = grunt.file.read(output_filepath);
        }

<<<<<<< Updated upstream
          }
        });
=======
        // Avoid write if there is no change
        if(output !== html) {
          grunt.file.write(output_filepath, html);
          grunt.log.writeln('✓ Styleguide ' + output_type + ' at: ' + grunt.log.wordlist([output_dir], {color: 'cyan'}));
        } else {
          grunt.log.writeln('‣ Styleguide unchanged');
        }

        promise();
>>>>>>> Stashed changes

      };

      // Parse files
      files.map(function(filename) {
        DSS.parse(grunt.file.read(filename), { file: filename }, parse_file);
      });

    });

  });

};
