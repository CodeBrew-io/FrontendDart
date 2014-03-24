var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    install = require('./plugins/install.js')
    express = require('express'),   
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

gulp.task('styles', function() {
    return gulp.src('web/styles/main.less')
        .pipe(less({ sourceMap: true }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('images', function() {
    return gulp.src('web/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('dart-js', function () {
  return gulp.src('web/*.dart')
        .pipe(spawn({cmd: "dart2js"}))
        .pipe(refresh(lrserver))
        .pipe(gulp.dest("dist/"));
});

gulp.task('html', function(){
    return gulp.src('web/[**/]*.html')
        .pipe(refresh(lrserver))
        .pipe(gulp.dest("dist/"));
});

gulp.task('clean', function() {
    return gulp.src([
        'dist/assets/css',
        'dist/assets/js',
        'dist/assets/img'], {read: false})
        .pipe(clean());
});

gulp.task('install', function(){
    install.bower();
    install.dart();
});

gulp.task('default', ['clean'], function() {
    console.log("run `gulp install` once");
    gulp.start('serve', 'watch');
});

gulp.task('serve', function(){
    var server = express();
    server.use(livereload({port: livereloadport}));
    server.use(express.static('./web'));
    server.listen(serverport);
    lrserver.listen(livereloadport);
});

gulp.task('watch', function() {
   gulp.watch('web/styles/**/*.less', ['styles']);
   gulp.watch('web/[**/]*.dart', ['dart-js']);
   gulp.watch('web/images/**/*', ['images']);
   gulp.watch('web/[**/]*.html', ['html']);
});