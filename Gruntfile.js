module.exports = function(grunt){
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    BASE_FOLDER: "assets",
    DIST_ENVIRONMENT: "build",

    BANNER_TEXT: 'Project: <%= pkg.name %>. Created by: <%= pkg.author %>. Version: <%= pkg.version %>.\n' +
      'This project is valid for the duration: <%= pkg.projectDetails.startDate %> - <%= pkg.projectDetails.endDate %>.',

    clean: {
      dev: ["<%= BASE_FOLDER%>/js/*.js"],
      dist: ["<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>"]
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= BANNER_TEXT %> */\n',
        // sourceMap: true,
        separator: ";"
      },
      devVendors: {
        src: ["<%= BASE_FOLDER %>/js/lib/jquery/*.js",
        "<%= BASE_FOLDER %>/js/lib/bootstrap/*.js",
        "<%= BASE_FOLDER %>/js/lib/owl-carousel/*.js",
        "<%= BASE_FOLDER %>/js/lib/slider/*.js"],
        dest: "<%= BASE_FOLDER %>/js/vendor.js"
      },
      devModules: {
        src: ["<%= BASE_FOLDER %>/js/modules/*"],
        dest: "<%= BASE_FOLDER %>/js/main.js"
      }
    },

    compass: {
      dev: {
        options: {
          sassDir: '<%= BASE_FOLDER %>/sass',
          cssDir: '<%= BASE_FOLDER %>/css',
          outputStyle: 'expanded',
          noLineComments: true
        }
      },
      dist: {
        options: {
          sassDir: '<%= BASE_FOLDER %>/sass',
          cssDir: '<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/css',
          outputStyle: 'compressed',
          noLineComments: true
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/index.html" : "<%= BASE_FOLDER%>/index.html"
        }
      }
    },

    uglify: {
      options:{
        banner: "/*! <%= BANNER_TEXT %> */",
        compress: {
          drop_console: true
        },
        sourceMap: true,
        preserveComments: false
      },
      dist: {
        files: {
          "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/main.js" : [
            "<%= BASE_FOLDER %>/js/main.js"
          ],
          "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/vendor.js" : [
            "<%= BASE_FOLDER %>/js/vendor.js"
          ]
        }
      }
    },

    copy: {
      imagesNFonts: {
        files: [
          {
            expand: true,
            cwd: "<%= BASE_FOLDER %>/",
            filter: "isFile",
            src: "img/**",
            dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
          },
          {
            expand: true,
            cwd: "<%= BASE_FOLDER %>/",
            filter: "isFile",
            src: "fonts/**",
            dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
          }
        ]
      }
    },

    watch: {
      options: {
        debounceDelay: 1000,
        livereload: true
      },
      html: {
        // DO NOT watch files inside BUILD folder
        files: ['<%= BASE_FOLDER %>/**/*.html', '!<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT%>/*.html'],
        tasks: ["htmlmin:dist"]
      },
      css: {
        files: ['<%= BASE_FOLDER %>/sass/**'],
        tasks: ["compass:dev"]
      },
      js: {
        files: ['<%= BASE_FOLDER %>/js/modules/*.js'],
        tasks: ["concat:devVendors", "concat:devModules"]
      }
    },

    connect: {
      dev: {
        options: {
          hostname: "localhost",
          port: 1985,
          base: "<%= BASE_FOLDER %>",
          middleware: function(connect,options){
            return [
              require('connect-livereload')(),
              connect.static(options.base[0], options),
              connect.directory(options.base[0])
            ];
          }
        }
      },
      dist: {
        options: {
          hostname: "localhost",
          port: 1986,
          base: ["<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT%>", "<%= BASE_FOLDER %>/build/css", "<%= BASE_FOLDER %>/build/js"],
          middleware: function(connect,options){
            return [
              require('connect-livereload')(),
              connect.static(options.base[0]),
              connect.directory(options.base[0])
            ];
          }
        }
      }
    },

    open: {
      dev: { path: "http://localhost:1985/" },
      dist: { path: "http://localhost:1986/" }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  // Generate DEVELOPMENT CONTENT
  grunt.registerTask("dev", "Run Build Process Tasks", function(){
    var tasks = [
      "clean:dev",
      "compass:dev",
      "concat",
      "open:dev",
      "connect:dev",
      "watch"
    ];

    // always use force when watching
    // grunt.option('force', true);
    grunt.task.run(tasks);
  });

  // Generate PRODUCTION CONTENT
  grunt.registerTask("build", "Run Build Process Tasks", function(){
    var tasks = [
      "clean:dist",
      "htmlmin:dist",
      "compass:dist",
      "uglify:dist",
      "copy:imagesNFonts",
      "open:dist",
      "connect:dist",
      "watch"
    ];

    // always use force when watching
    // grunt.option('force', true);
    grunt.task.run(tasks);
  });
};
