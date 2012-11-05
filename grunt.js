/*global module:false*/

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: '<json:jquery.spellchecker.json>',
    meta: {
      banner: '/*\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/js/<%= pkg.name %>.js>', '<banner:meta.test'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    copy: {
      dist: {
        files: {
          "dist/examples/": "src/examples/**",
          "dist/css/": "src/css/*",
          "dist/webservices/php/": "src/webservices/php/**",
          "dist/js/libs/jquery/": "src/js/libs/jquery/jquery-1.8.2.min.js"
        }
      }
    },
    min: {
      dist: 
        {
          src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
          dest: 'dist/js/<%= pkg.name %>.min.js'
        }
    },
    mincss: {
      compress: {
        files: {
          "dist/css/jquery.spellchecker.min.css": ["src/css/jquery.spellchecker.css"]
        }
      }
    },
    compress: {
      zip: {
        files: {
          "archive/jquery.spellchecker-<%= pkg.version %>.zip": "dist/**"
        }
      }
    },
    jasmine : {
      src : [
        'src/js/libs/jquery/jquery-1.8.2.min.js',
        'src/js/jquery.spellchecker.js'
      ],
      specs : 'tests/javascript/spec/**/*.js'
    },
    lint: {
      files: ['grunt.js', 'src/js/jquery.spellchecker.js', 'tests/javascript/**/*.js']
    },
    jshint: {
      options: {
        curly: false,
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
        $: true,
        alert: false
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jasmine-runner');

  grunt.registerTask('default', 'lint jasmine concat min mincss copy compress');
};
