module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    postcss: {
        options: {
            map: true, // inline sourcemaps
            processors: [
                require('postcss-import'), // add @import to css files
                require('tailwindcss'), // tailwinds support
                require('pixrem')(), // add fallbacks for rem units
                require('autoprefixer'), // add vendor prefixes
                require('cssnano')() // minify the result
            ]
        },
        dist: {
            src: 'styles/root.css',
            dest: 'public/static/css/main.css'
        }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');

  // Default task(s).
  grunt.registerTask('default', ['postcss']);

};