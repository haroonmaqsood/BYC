module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: 'bin/www'
        }
      }
    },

    watch: {
      express: {
        files:  ['./Gruntfile.js', './app.js', 'public/**/*.js', 'public/**/*.html', 'public/**/style.less', 'views/**/*.html', 'routes/**/*.js', 
          'model.js', 'configs/**/*.js', 'bin/**/*.js'],
        tasks:  [ 'less:dev', 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. 
                       // Without this option specified express won't be reloaded
        }
      }
    },

  less: {
    dev: {
      options: {
        cleancss: false
      },
      files: {
        "public/css/style.css": "public/less/style.less",
      }
    }
  }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-less');

  // can be an array of tasks, but tasks are all run via the watch config for now
  grunt.registerTask('default', ['less:dev', 'express:dev', 'watch']);
};