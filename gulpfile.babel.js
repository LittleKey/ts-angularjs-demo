import path from 'path';
import gulp from 'gulp';
import concat from 'gulp-concat';
import less from 'gulp-less';
import cssmin from 'gulp-cssmin';
import htmlmin from 'gulp-htmlmin';
import rev from 'gulp-rev';
import uglify from 'gulp-uglify';
import usemin from 'gulp-usemin';
import ts from 'gulp-typescript';
import yargs from 'yargs';
import child_process from 'child_process';
import sequence from 'gulp-sequence';
import templatecache from 'gulp-angular-templatecache';

let htmlminOptions = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  collapseInlineTagWhitespace: true,
  collapseBooleanAttributes: true,
  removeTagWhitespace: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  // To use this configuration, make sure your server sent Content-Type header correctly
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true
};

gulp.task('html', ()=> {
  let useminConfig = yargs.argv.debug ? {
    html: [ () => htmlmin(htmlminOptions) ],
    css: [],
    less: [less({paths: [path.join(__dirname, "src/stylesheet")]})],
    js: [],
    vendorjs: [],
  } : {
    html: [ () => htmlmin(htmlminOptions) ],
    css: [cssmin, rev],
    less: [less({paths: [path.join(__dirname, "src/stylesheet")]}), cssmin, rev],
    js: [uglify, rev],
    vendorjs: [rev],
  };
  
  return gulp.src('src/*.html')
    .pipe(usemin(useminConfig))
    .pipe(gulp.dest('dist'))
});

let tsProj = ts.createProject('tsconfig.json');

gulp.task('script:templatecache', ()=> {
  return gulp.src('src/template/*.html')
    .pipe(htmlmin(htmlminOptions))
    .pipe(templatecache('templates.js', {
      module: 'app'
    }))
    .pipe(gulp.dest('build/script'))
});
gulp.task('script', cb => {
  child_process.exec('tsc -p .', ()=> {
    cb()
  });
});

gulp.task('asset', ()=> {
  return gulp.src(['src/asset/**/*'])
    .pipe(gulp.dest('dist/asset'));
});

gulp.task('watch', ()=> {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/stylesheet/**/*', ['html']);
  gulp.watch('src/template/**/*', ['script:templatecache', 'html']);
  gulp.watch('build/script/*.js', ['html']);
  // gulp.watch('src/script/**/*.ts', ['script', 'html']);
});

gulp.task('build', sequence(['asset', 'script', 'script:templatecache'], 'html'));
