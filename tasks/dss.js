/*
 * DSS
 * https://github.com/darcyclarke/DSS
 *
 * Copyright (c) 2013 darcyclarke
 * Licensed under the MIT license.
 */

// Include dependancies
var handlebars = require('handlebars');
var dss = require('dss');

// Expose
module.exports = function(grunt){

  // Register DSS
  grunt.registerMultiTask('dss', 'Parse DSS comment blocks', function(){

    // Setup async promise
    var promise = this.async();

    // Merge task-specific and/or target-specific options with defaults
    var options = this.options({
      template: __dirname + '/../template/',
      template_index: 'index.handlebars',
      output_index: 'index.html',
      include_empty_files: true,
      external_markup: false,
      misc_sections: [],
      site_prefix: ''
    });

    // Output options if --verbose cl option is passed
    grunt.verbose.writeflags(options, 'Options');

    // Describe custom parsers
    for(key in options.parsers){
      dss.parser(key, options.parsers[key]);
    }

    // Build Documentation
    this.files.forEach(function(f){

      // Filter files based on their existence
      var src = f.src.filter(function(filepath) {

        // Warn on and remove invalid source files (if nonull was set).
        if(!grunt.file.exists(filepath)){
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      // Setup
      var files = src,
          template_dir = options.template,
          output_dir = f.dest,
          length = files.length,
          styleguide = [];

      // Parse files
      files.map(function(filename){

        // Report file
        grunt.verbose.writeln('• ' + grunt.log.wordlist([filename], {color: 'cyan'}));

        // Parse
        dss.parse(grunt.file.read(filename), { file: filename }, function(parsed) {

          // Continue only if file contains DSS annotation
          if (options.include_empty_files || parsed.blocks.length) {
            
            //Pull in markup from external files with same name as block
            if (options.external_markup) {
              parsed.blocks.forEach(function(b){
                var external_markup_path = grunt.file.read('markup/' + b.name + '.html');
                var external_markup = grunt.file.exists(external_markup_path) ? grunt.file.read(external_markup_path) : 'Cannot find markup file';
                b.external_markup = {
                  example: external_markup,
                  escaped: external_markup.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                }

                //If there are states, pull in markup for them too
                //Looks for blockname-statenameescaped.html
                if (b.state) {
                  b.state.forEach(function(s){
                    var state_markup_path = 'markup/' + b.name + '-' + s.escaped + '.html';
                    s.state_markup = grunt.file.exists(state_markup_path) ? grunt.file.read(state_markup_path) : 'Cannot find state markup file';
                  });
                }
              });
            }

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

            if (!grunt.file.exists(template_filepath)) {
              grunt.fail.fatal('Cannot read the template file');
            }

            // copy template assets (except index.handlebars)
            grunt.file.expandMapping([
              '**/*',
              '!' + options.template_index
            ], output_dir, { cwd: template_dir }).forEach(function(filePair) {
              filePair.src.forEach(function(src) {
                if (grunt.file.isDir(src)) {
                  grunt.verbose.writeln('Creating ' + filePair.dest.cyan);
                  grunt.file.mkdir(filePair.dest);
                } else {
                  grunt.verbose.writeln('Copying ' + src.cyan + ' -> ' + filePair.dest.cyan);
                  grunt.file.copy(src, filePair.dest);
                }
              });
            });

            //Add extra sections if any
            var misc_sections = [];
            if (options.misc_sections.length) {
              options.misc_sections.forEach(function(t) {
                misc_sections.push({
                  title: t.title,
                  class: t.class,
                  markup: grunt.file.exists(t.src) ? grunt.file.read(t.src) : 'Cannot find section file'
                });
              });
            }

            // Create HTML ouput
            var html = handlebars.compile(grunt.file.read(template_filepath))({
              project: grunt.file.readJSON('package.json'),
              files: styleguide,
              misc_sections: misc_sections,
              site_prefix: options.site_prefix
            });


            var output_type = 'created', output = null;
            if (grunt.file.exists(output_filepath)) {
              output_type = 'overwrited';
              output = grunt.file.read(output_filepath);
            }
            // avoid write if there is no change
            if (output !== html) {
              // Render file
              grunt.file.write(output_filepath, html);

              // Report build
              grunt.log.writeln('✓ Styleguide ' + output_type + ' at: ' + grunt.log.wordlist([output_dir], {color: 'cyan'}));
            }
            else {
              // no change
              grunt.log.writeln('‣ Styleguide unchanged');
            }

            // Return promise
            promise();

          }
        });

      });

    });

  });

};
