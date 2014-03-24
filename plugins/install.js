var spawn = require('child_process').spawn,
	gutil = require('gulp-util');

function run(command, args){
    var child = spawn(command, args, {cwd: process.cwd()});

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        gutil.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        gutil.log(gutil.colors.red(data));
        gutil.beep();
    });

    child.on('close', function(code) {
        gutil.log("Done with exit code", code);
    });
}

exports.dart = function(){
	run("pub", ["get"]);
}
exports.bower = function(){
    run("bower", ["install"]);
}

exports.run = run;

// gulp.task('scripts', function() {
//     return gulp.src('web/scripts/**/*.js')
//         .pipe(jshint('.jshintrc'))
//         .pipe(jshint.reporter(stylish))
//         .pipe(concat('main.js'))
//         .pipe(gulp.dest('dist/assets/js'))
//         .pipe(rename({suffix: '.min'}))
//         .pipe(uglify({outSourceMap: true}))
//         .pipe(gulp.dest('dist/assets/js'))
//         .pipe(livereload(lrserver))
//         .pipe(notify({ message: 'Scripts task complete' }));
// });