var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    express = require('express'),   
    install = require('./plugins/install.js')
    less = require('gulp-less'),
    livereload = require('connect-livereload'),
    lrserver = require('tiny-lr')(),
    spawn = require("gulp-spawn"),
    refresh = require('gulp-livereload'),
    rename = require('gulp-rename');

var livereloadport = 35729,
    serverport = 5000;

gulp.task('styles', function() {
    return gulp.src('styles/main.less')
        .pipe(less())
        .pipe(gulp.dest('web/styles/css'))
        .pipe(refresh(lrserver));
});

gulp.task('dart', function(){
    return gulp.src(['web/**/*.dart','!web/packages/**'])
        .pipe(refresh(lrserver));
})

gulp.task('html', function(){
    return gulp.src('web/**/*.html')
        .pipe(refresh(lrserver));
});

gulp.task('install', function(){
    install.bower();
    install.dart();
});

gulp.task('default', function() {
    gulp.start('styles', 'serve', 'watch');
    install.run("dartium");
});

gulp.task('serve', function(){
    var server = express();
    server.use(livereload({port: livereloadport}));
    server.use(express.static('web'));
    server.use(express.static('bower_components'));
    server.use(express.static('styles'));
    server.listen(serverport);
    lrserver.listen(livereloadport);
});

gulp.task('watch', function() {
   gulp.watch('styles/**/*.less', ['styles']);
   gulp.watch('web/**/*.dart', ['dart']);
   gulp.watch('web/**/*.html', ['html']);
});