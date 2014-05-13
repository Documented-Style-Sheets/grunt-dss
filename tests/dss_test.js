'use strict';

var grunt = require('grunt');
var fs = require('fs');

exports.DSS = {
  'copy doc assets': function(test) {
    test.expect(7);

    var expects = {
        docs: grunt.file.isDir('docs'),
        css: grunt.file.isDir('docs/assets/css'),
        styles: grunt.file.exists('docs/assets/css/styles.css'),
        js: grunt.file.isDir('docs/assets/js'),
        // we assume that if the styles.css have been correctly copied, prettify files will be also here
        // we don't want to check all files because it's useless ?
        js_prettify: grunt.file.isDir('docs/assets/js/prettify'),
        styleguide: grunt.file.exists('docs/index.html'),
        template: grunt.file.exists('docs/index.mustache'),
    };

    test.equal(expects.docs, true, 'should create the docs directory');
    test.equal(expects.css, true, 'should create the css directory');
    test.equal(expects.styles, true, 'should create the styles.css file');
    test.equal(expects.js, true, 'should create the js directory');
    test.equal(expects.js_prettify, true, 'should create the js directory prettify file');
    test.equal(expects.styleguide, true, 'should create the index.html file');
    test.equal(expects.template, false, 'should not create the index.mustache file');

    test.done();
  },

};

