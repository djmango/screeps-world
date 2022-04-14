module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: '<your e-mail>',
                token: '<your auth token>',
                branch: 'default',
                //server: 'season'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}