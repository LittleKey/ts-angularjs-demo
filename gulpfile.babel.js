import gulp from 'gulp';
import clean from 'gulp-clean';
import cssmin from 'gulp-cssmin';
import htmlmin from 'gulp-htmlmin';
import templateCache from 'gulp-angular-templatecache';
import sequence from 'gulp-sequence';
import yargs from 'yargs';
import inject from 'gulp-inject';
import bowerFiles from 'main-bower-files';
import concat from 'gulp-concat';
import wiredep from 'wiredep';
import uglify from 'gulp-uglify';
import rev from 'gulp-rev';
import streamify from 'gulp-streamify';
import ts from 'gulp-typescript';
import less from 'gulp-less';

let tsProj = ts.createProject('tsconfig.json');
let isProduction = yargs.argv.prod;

gulp.task('stylesheet:clean', ()=>{
  return gulp.src('dist/stylesheet')
    .pipe(clean())
});

gulp.task('stylesheet', ()=>{
  let stream = gulp.src('src/less/app.less')
    .pipe(less());
  if (isProduction) {
    stream = stream.pipe(cssmin())
  }
  return stream.pipe(concat('app.css'))
    .pipe(rev())
    .pipe(gulp.dest('dist/stylesheet'))
    .pipe(rev.manifest('dist/rev-manifest.json', {merge: true}))
    .pipe(gulp.dest('./'))
});

gulp.task('stylesheet:vendor', ()=> {
  let sources = isProduction ? ['bower_components/**/*.min.css'] : wiredep().css;
  if (!sources) {
    sources = [];
  }
  sources = sources.concat(['src/css/**/*.css']);
  return gulp.src(sources)
    .pipe(concat('vendor.css'))
    .pipe(rev())
    .pipe(gulp.dest('dist/stylesheet'))
    .pipe(rev.manifest('dist/rev-manifest.json', {merge: true}))
    .pipe(gulp.dest('./'))
});

gulp.task('script', ()=>{
  let stream = tsProj.src()
    .pipe(ts(tsProj));
  if (isProduction) {
    stream = stream.pipe(streamify(uglify()));
  }
  return stream
    .pipe(gulp.dest('dist/script'));
});

gulp.task('script:clean', ()=>{
  return gulp.src('dist/script').pipe(clean())
});

gulp.task('script:vendor', ()=> {
  let sources = isProduction ? 'bower_components/**/*.min.js' : wiredep().js;
  return gulp.src(sources)
    .pipe(concat('vendor.js'))
    .pipe(rev())
    .pipe(gulp.dest('dist/script'))
    .pipe(rev.manifest('dist/rev-manifest.json', {merge: true}))
    .pipe(gulp.dest('./'))
});

gulp.task('html', ()=>{
  let sources = [
    'dist/script/vendor*.js',
    'dist/script/*.js',
    'dist/stylesheet/vendor*.css',
    'dist/stylesheet/*.css'
  ];
  let stream = gulp.src('src/*.html')
    .pipe(inject(gulp.src(sources, {read: false}), {ignorePath: ['dist/']}));
  if (isProduction) {
    stream = stream.pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      //conservativeCollapse: true,
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: true,
      removeTagWhitespace: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      // To use this configuration, make sure your server sent Content-Type header correctly
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }));
  }
  return stream.pipe(gulp.dest('dist'));
});

gulp.task('templates:clean', ()=>{
  return gulp.src('dist/templates').pipe(clean())
});

gulp.task('templates:cache', ()=>{
  return gulp.src('src/templates/**/*.html')
    .pipe(templateCache({
      module: 'App',
      root: 'templates/'
    }))
    .pipe(gulp.dest('dist/script'))
});

gulp.task('templates', ()=>{
  return gulp.src('src/templates/**/*.html').pipe(gulp.dest('dist/templates'))
});

gulp.task('combine', ()=> {
  let stream = gulp.src(['dist/script/app.js', 'dist/script/templates.js'])
    .pipe(clean())
    .pipe(concat('app.js'))
    .pipe(rev())
    .pipe(gulp.dest('dist/script'))
    .pipe(rev.manifest('dist/rev-manifest.json', {merge: true}))
    .pipe(gulp.dest('./'));
  return stream;
})

gulp.task('watch', ()=>{
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/ts/**/*.ts', ['script']);
  gulp.watch('src/less/**/*.less', ['stylesheet']);
  gulp.watch('bower.json', ['script:vendor']);
});

// we dont need bootstrap javascript essentials(e.g. jQuery and itself),
// so produce a clean before compile
gulp.task('preclean', ()=>{
  return gulp.src(['bower_components/bootstrap/dist/js/*', 'bower_components/jquery/**/*.js'])
    .pipe(clean());
});

gulp.task('build', sequence(
  'preclean',
  'script:clean', ['script:vendor', 'script'],
  'templates:cache', 'combine',
  'stylesheet:clean', ['stylesheet:vendor', 'stylesheet'],
  'html',
  'templates:clean', 'templates'));
