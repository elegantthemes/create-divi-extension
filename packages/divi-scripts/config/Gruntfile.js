const path = require('path');
const paths = require('./paths');

module.exports = function(grunt) {
  grunt.initConfig({
    compress: {
      main: {
        options: {
          archive: `${path.basename(paths.appBuild)}.zip`,
          mode: 'zip',
          level: 9,
        },
        files: [
          {
            expand: true,
            src: [
              '**',
              '!**/.*/**', // Hidden files/dirs on Mac/Linux
              '!**/__*/**', // Hidden dirs on Mac
              '!**/less/**',
              '!**/node_modules/**',
              '!**/*.zip',
              '!**/*.map',
              '!**/Gruntfile.js',
              '!asset-manifest.json',
              '!**/*.json',
              '!**/*.conf{,ig}.js',
              '!**/*.lock',
              '!**/*.yml',
              '!**/*.scss',
              '!**/*.less',
              '!**/*.log',
              '!**/*.jsx',
              '!**/!(*.min.){js,css}', // Non-minified styles and scripts
              '!**/__*.*', // Additional source files that should be excluded from zip archive
            ],
            dest: path.basename(paths.appBuild),
          },
        ],
      },
    },
    makepot: {
      target: {
        options: {
          domainPath: '/languages/',
          potFilename: 'en_US.po',
          type: 'wp-plugin',
          potHeaders: {
            poedit: true, // Includes common Poedit headers.
            'x-poedit-keywordslist': true, // Includes a list of all possible gettext functions.
          },
          updatePoFiles: true,
        },
      },
    },
    po2mo: {
      files: {
        src: 'languages/*.po',
        expand: true,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-wp-i18n');
  grunt.loadNpmTasks('grunt-po2mo');

  grunt.registerTask('default', ['zip']);
  grunt.registerTask('zip', ['makepot', 'po2mo', 'compress']);
};
