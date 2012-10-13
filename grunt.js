/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:spellchecker.jquery.json>',
    meta: {
      banner: '/*\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/js/<%= pkg.name %>.js>'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: 
        {
          src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
          dest: 'dist/js/<%= pkg.name %>.min.js'
        }
        //,
        // {
        //   src: 'src/css/<%= pkg.name %>.css',
        //   dest: 'dist/css/<%= pkg.name %>.min.css'
        // }
      
    },
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    lint: {
      files: ['grunt.js', 'src/js/jquery.spellchecker.js', 'test/**/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        alert: false
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};
