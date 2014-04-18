var run = require('./run.js'),
	es = require('event-stream'),
	gutil = require('gulp-util');

module.exports = function(){
	return es.map(function (file){
		return run("protoc", ["--proto_path="+ file.cwd, "--dart_out=.", file.path]);
	});
}