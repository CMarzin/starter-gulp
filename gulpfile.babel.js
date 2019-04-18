import gulp from 'gulp';
import babel from 'gulp-babel';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';

gulp.task('html', () => {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('styles', () => {
    return gulp.src('./app/stylesheets/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  const bundleStream = browserify({
    entries: './app/scripts/main.js',
    'transform': [
      babelify.configure({
          'presets': ['@babel/preset-env']
      })
  ]
  }).bundle()

  bundleStream
    .pipe(plumber())
    // .pipe(babel({
    //     presets: ['@babel/preset-env']
    // }))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream({
      stream: true
    }));
});

gulp.task('startServer', () => {
    browserSync.init({
        server: './build',
        open: false
    });
    gulp.watch('./app/scripts/**/*.js', gulp.series('scripts'));
});

gulp.task('watch', () => {
    gulp.watch('./app/*.html', gulp.series('html'));
    gulp.watch('./app/scripts/*.js', gulp.series('scripts'));
    gulp.watch('./app/stylesheets/**/*.scss', gulp.series('styles'));
});

gulp.task('build', gulp.parallel('html', 'scripts', 'styles'));
gulp.task('dev', gulp.parallel('build', 'startServer', 'watch'));
