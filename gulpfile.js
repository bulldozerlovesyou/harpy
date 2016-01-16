var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var sourcemaps = require('gulp-sourcemaps');
var include = require('gulp-include');
var css = require('css');
var browserSync = require('browser-sync').create();
var cssInfo = require('gulp-css-info');

// Static Server + watching scss/html files
gulp.task('serve', function() {
	browserSync.init({
		server: "./dist"
	});
	gulp.watch("dist/**/*.{html,js,css}").on('change', browserSync.reload);
});

// HTML
gulp.task('html', function() {
	return gulp.src('src/**/*.html').pipe(gulp.dest('dist/'));
});

// JS
gulp.task('js', function() {
	return gulp.src('src/js/main.js')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(include())
		.pipe(uglify({
				preserveComments: 'some'
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('dist/js/'));
});

// SCSS
gulp.task('css', function() {
	return gulp.src('src/scss/*.scss')
	// error handling
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sass({ style: 'expanded' }))
	.pipe(autoprefixer({browsers: ['last 2 versions','> 1% in SE']}))
	.pipe(gulp.dest('dist/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('dist/css'))

	.pipe(notify("SCSS minified"));
});

// CSS info
gulp.task('css-info', function() {
	return gulp.src(['dist/**/*.css'])
		.pipe(cssInfo.html())
		.pipe(gulp.dest('dist/css-info'));
});
gulp.task('css-info-json', function() {
	return gulp.src(['dist/**/*.css'])
		.pipe(cssInfo({indent: 2}))
		.pipe(gulp.dest('dist/css-info'));
});
gulp.task('css-info/watch', ['css-info'], function() {
	gulp.watch('dist/**/*.css', ['css-info']);
});

// Watch
gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', ['css']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/**/*.html', ['html']);
});

// Defaults
gulp.task('no-server', ['css', 'js', 'watch'], function() {});

// Defaults
gulp.task('default', ['serve', 'css', 'js', 'html', 'watch'], function() {});
