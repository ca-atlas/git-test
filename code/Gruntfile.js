module.exports = function (grunt) {
  const sass = require('node-sass');
  require('load-grunt-tasks')(grunt);

  var Config = {
    root: 'site', // No root
    //root: 'static',
    sass: '<%= Config.root %>/assets/styles/sass',
    css: '<%= Config.root %>/assets/styles/css',
    scripts: '<%= Config.root %>/assets/scripts'
  };

  var Styles = [
    '<%= Config.css %>/style.css',
  ];

  grunt.initConfig({
    Config: Config,
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= Config.sass %>/',
          src: ['**/*.scss'],
          dest: '<%= Config.css %>/',
          ext: '.css'
        }],
        options: {
          implementation: sass,
          sourceMap: false,
          quiet: true, // silence deprecation warnings
          style: 'expanded'
        }
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= Config.sass %>/',
          src: ['**/*.scss'],
          dest: '<%= Config.css %>/',
          ext: '.css'
        }],
        options: {
          implementation: sass,
          sourceMap: true,
          //quiet: true, // silence deprecation warnings
          style: 'expanded'
        }
      }
    }, // end sass

    /*jshint: {
      all: ['scripts/dist/app.js']
    },*/

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: {
          except: ['jQuery', 'Modernizr']
        }
      },
      dev: {
        options: {
          properties: false,
          beautify: true,
          compress: false,
          mangle: false,
          sourceMap: true
        },
        files: {
          '<%= Config.scripts %>/dist/app.js': [ '<%= Config.scripts %>/libs/*.js' , '<%= Config.scripts %>/main/*.js']
        }
      },
      dist: {
        options: {
          mangle: false,
          beautify: false,
          compress: false,
        },
        files: {
          '<%= Config.scripts %>/dist/app.js': [ '<%= Config.scripts %>/libs/*.js' , '<%= Config.scripts %>/main/*.js']
        }
      }
    }, // end uglify

    autoprefixer: {
      options: {
        browsers: ['last 3 version',  '> 5%', 'ie >= 8'],
        map: true
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: '<%= Config.css %>/*.css',
        dest: '<%= Config.css %>/'
      },
    }, // end autopreixfer

    combine_mq: {
      default_options: {
        expand: true,
        cwd: '<%= Config.css %>',
        src: ['*.css'],
        dest: '<%= Config.css %>/'
      }
    }, // end combine_mq

    watch: {
      livereload: {
        files: [
          '<%= Config.scripts %>/dist/app.js',
          '<%= Config.css %>/style.css',
          '**.html',
          'site/pages/*.html'
        ],
        options: {
          livereload: true
        }
      },
      images: {
        files: ['images/**']
      },
      css: {
        files: ['<%= Config.sass %>/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      scripts: {
        files: ['<%= Config.scripts %>/libs/*.js', '<%= Config.scripts %>/main/*.js'],
        tasks: ['uglify:dev']
      }
    }, // end watch

    connect: {
      options: {
        port: 3131,
        open: true,
        hostname: 'localhost',
        base: 'site',
        //keepalive: true,
        livereload: true
      },
      dev: {
        middleware: function (connect) {
          return [
            require('connect-livereload')(),
          ];
        }
      }
    }, // end connect

    // localhosts: {
    //   set : {
    //     options: {
    //       rules: [{
    //         ip: '127.0.0.1',
    //         hostname: 'rdvc.dev',
    //         type: 'set'
    //       }]
    //     }
    //   },
    //   remove : {
    //     options: {
    //       rules: [{
    //         ip: '127.0.0.1',
    //         hostname: 'rdvc.dev',
    //         type: 'remove'
    //       }]
    //     }
    //   }
    // } // end localhosts

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-localhosts');

  // default tasks
  grunt.registerTask('default', [ 'dev-static' ]);
 // grunt.registerTask('default', [ 'dev' ]);
  grunt.registerTask('build', [ 'dist' ]);

// development task
  grunt.registerTask('dev-static', [
    'connect:dev',
    'sass:dev',
    'autoprefixer',
    'uglify:dev',
    'watch',
  ]);

  // development task
  grunt.registerTask('dev', [
    'connect:dev',
    'sass:dev',
    'autoprefixer',
    'uglify:dev',
    'watch'
  ]);

  // distribution task
  grunt.registerTask('dist', [
    'sass:dist',
    'autoprefixer',
    'combine_mq',
    'uglify:dist'
  ]);

  grunt.registerTask('host-set', ['localhosts:set']);
  grunt.registerTask('host-remove', ['localhosts:remove']);

};
