var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    express = require('express'),   
    install = require('./plugins/install.js'),
    run = require('./plugins/run.js'),
    protobuf = require('./plugins/protobuf.js'),
    less = require('gulp-less'),
    livereload = require('connect-livereload'),
    lrserver = require('tiny-lr')(),
    spawn = require("gulp-spawn"),
    refresh = require('gulp-livereload'),
    rename = require('gulp-rename');

var livereloadport = 35729,
    serverport = 5000;

gulp.task('styles', function() {
    gulp.src('styles/main.less')
        .pipe(less())
        .pipe(gulp.dest('web/styles/css'))
        .pipe(refresh(lrserver));
});

gulp.task('protobuf', function(){
    gulp.src(["api/hello.proto"])
        .pipe(protobuf());
})

gulp.task('dart', function(){
    gulp.src(['!web/**/packages', 'web/src/**/*.dart'])
        .pipe(refresh(lrserver));
})

gulp.task('html', function(){
    gulp.src('web/**/*.html')
        .pipe(refresh(lrserver));t
});

gulp.task('bower', function(){
    gulp.src('bower.json')
        .pipe(install.bower())
        .pipe(refresh(lrserver));
});

gulp.task('install', ['bower', 'npm', 'pub']);

gulp.task('pub', function(){
    gulp.src('pubspec.yaml')
        .pipe(install.dart())
        .pipe(refresh(lrserver));
});

gulp.task('npm', function(){
    gulp.src('package.json')
        .pipe(install.npm())
        .pipe(refresh(lrserver));
});

gulp.task('dartium', function(){
    run("dartium",['http://localhost:' + serverport]);
});

gulp.task('default', function() {
    gulp.start('install', 'styles', 'serve', 'dartium', 'watch');
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
    gulp.watch('api/*.proto', ['protobuf']);
    gulp.watch('styles/**/*.less', ['styles']);
    gulp.watch(['!web/**/packages', 'web/**/*.dart'], ['dart']);
    gulp.watch('web/**/*.html', ['html']);
    gulp.watch('bower.json', ['bower']);
    gulp.watch('pubspec.yaml', ['pub']);
    gulp.watch('package.json', ['npm']);
});