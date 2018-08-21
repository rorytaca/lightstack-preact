const gulp = require('gulp');
const bro = require('gulp-bro');
const babelify = require('babelify');
const concat = require('gulp-concat');
const declare = require('gulp-declare');
const minify = require('gulp-minify');
const gulpSequence = require('gulp-sequence');
const errorHandler = require('gulp-error-handle');
const handlebars = require('gulp-handlebars');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const wrap = require('gulp-wrap');
const livereload = require('gulp-livereload');
const ifEnv = require('gulp-if-env');

const logError = (err) => {
  console.error(err);
  this.emit('end');
};

gulp.task('js-libraries', () => {
  return gulp.src('frontend/javascripts/lib/*.js')
    .pipe(errorHandler(logError))
    .pipe(concat('libraries.js'))
    .pipe(ifEnv.not('development', minify({
      ext: {
        min: '.min.js'
      },
    })))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('component-templates', () => {
  return gulp.src('views/components/*.hbs')
    .pipe(errorHandler(logError))
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Handlebars.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(ifEnv.not('development', minify({
      ext: {
        min: '.min.js'
      },
    })))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('js-main', () => {
  return gulp.src([
    // 'frontend/javascripts/polyfills.js', @TODO:: Will this be baked in to all projects???
    'frontend/javascripts/initializers.js', 
    'frontend/javascripts/utils.js', 
    'frontend/javascripts/behave.js', 
    'frontend/javascripts/services/*.js', 
  ])
    .pipe(errorHandler(logError))
    .pipe(bro({
      insertGlobals: true,
      transform: [
        babelify.configure({
          presets: ['env'],
        }),
      ],
    }))
    .pipe(concat('main.js'))
    .pipe(ifEnv.not('development', minify({
      ext: {
        min: '.min.js'
      },
    })))
    .pipe(gulp.dest('public/javascripts'));
});

// gulp.task('jsx-preact', () => {
//   return gulp.src([
//     'frontend/jsx/**/*.jsx'
//   ])
//     .pipe(errorHandler(logError))
//     .pipe(bro({
//       insertGlobals: true,
//       transform: [
//         babelify.configure({
//           presets: ['react', 'env'],
//           plugins: [
//             ['transform-react-jsx', {'pragma':'h'}],
//             ['transform-object-rest-spread']
//           ],
//         }),
//       ],
//     }))
//     .pipe(concat('preact-components.js'))
//     .pipe(ifEnv.not('development', minify({
//       ext: {
//         min: '.min.js'
//       },
//     })))
//     .pipe(gulp.dest('public/javascripts'));
// });
gulp.task('js-components', () => {
  return gulp.src([
    'frontend/javascripts/components/*.js'
  ])
    .pipe(errorHandler(logError))
    .pipe(bro({
      insertGlobals: true,
      transform: [
        babelify.configure({
          presets: ['env'],
        }),
      ],
    }))
    .pipe(ifEnv.not('development', minify({
      ext: {
        min: '.js'
      },
    })))
    .pipe(gulp.dest('public/javascripts/components/'));
});

gulp.task('js-controllers', () => {
  return gulp.src([
    'frontend/javascripts/controllers/*.js'
  ])
    .pipe(errorHandler(logError))
    .pipe(bro({
      insertGlobals: true,
      transform: [
        babelify.configure({
          presets: ['env'],
        }),
      ],
    }))
    .pipe(ifEnv.not('development', minify({
      ext: {
        min: '.js'
      },
    })))
    .pipe(gulp.dest('public/javascripts/controllers/'));
});

gulp.task('css', () => {
  return gulp.src('frontend/stylesheets/main.scss')
    .pipe(errorHandler(logError))
    .pipe(ifEnv.not('production', sourcemaps.init({loadMaps: true})))
    .pipe(concat('bundle.min.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(ifEnv.not('production', sourcemaps.write('.')))
    .pipe(gulp.dest('public/stylesheets'));
});

// gulp.task('build', gulpSequence('js-libraries', 'component-templates', 'js-main', 'jsx-preact', 'js-controllers', 'css'));
gulp.task('build', gulpSequence('js-libraries', 'component-templates', 'js-main', 'js-controllers', 'js-components', 'css'));

gulp.task('watch', () => {
  livereload.listen();

  gulp.watch('frontend/stylesheets/**/*.+(css|scss)', ['css']);

  gulp.watch('frontend/javascripts/lib/*.js', (event) => {
    gulpSequence('js-libraries')((err) => {
      if (err) console.error(err)
    });
  });

  gulp.watch('views/components/*.hbs', (event) => {
    gulpSequence('component-templates')((err) => {
      if (err) console.error(err)
    });
  });

  gulp.watch('frontend/javascripts/*.js', (event) => {
    gulpSequence('js-main')((err) => {
      if (err) console.error(err)
    });
  });

  gulp.watch('frontend/javascripts/services/*.js', (event) => {
    gulpSequence('js-main')((err) => {
      if (err) console.error(err)
    });
  });

  gulp.watch(['frontend/javascripts/components/*.js','frontend/javascripts/controllers/*.js'], (event) => {
    gulpSequence('js-controllers')((err) => {
      if (err) console.error(err)
    });
  });
  
  // gulp.watch(['frontend/jsx/**/*.jsx'], (event) => {
  //   gulpSequence('jsx-preact')((err) => {
  //     if (err) console.error(err)
  //   });
  // });
});

gulp.task('serve', () => {
  nodemon({
    script: 'bin/www',
    ext: 'js hbs',
    ignore: ['node_modules/', 'public/', 'frontend/']
  });
});

gulp.task('dev', gulpSequence('build', 'watch', 'serve'));
gulp.task('default', ['build']);