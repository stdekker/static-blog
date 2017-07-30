/* File: gulpfile.js */

// grab our gulp packages
var gulp   = require('gulp'),
    gutil  = require('gulp-util');
    sass   = require('gulp-sass');
    prefix = require('gulp-autoprefixer');
    twig   = require('gulp-twig');
    image  = require('gulp-image');
    cleanCSS = require('gulp-clean-css');
    browserSync = require('browser-sync').create();

// Watch for changes in the source
gulp.task('watch', function() {
  gulp.watch('source/scss/**/*.*', ['build-css']);
  gulp.watch('source/pages/**/*.*', ['build-html']);
  gulp.watch('source/images/**/*.*', ['process-images']);

  // Reload the browser when something public changes
  gulp.watch('public/**/*.*', browserSync.reload); 

});

// Compile Sass to CSS
gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/stylesheets'));
});

// Compile Twig templates to HTML
gulp.task('build-html', function() {
    return gulp.src('source/pages/*.html') // run the Twig template parser on all .html files in the "src" directory
        .pipe(twig())
        .pipe(gulp.dest('public')); // output the rendered HTML files to the "dist" directory
});

// Optimize images
gulp.task('process-images', function () {
  gulp.src('./source/images/**/*.*')
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: true,
      jpegoptim: true,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: true,
      concurrent: 10
    }))
    .pipe(gulp.dest('./public/images'));
});

// Watch scss AND html files and handle each change accordingly.
gulp.task('live', function () {

    // Serve files from the public directory of this project
    browserSync.init({
        server: {
            baseDir: "./public/",
        }
    });
});

gulp.task('init',['build-html','build-css','process-images']);
gulp.task('default',['init','watch','live']);
