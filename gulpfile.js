const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    cleaner = require('gulp-clean'),
    concat = require('gulp-concat'),
    minify = require('gulp-js-minify'),
    uglify = require('gulp-uglify'),
    pipeline = require('readable-stream').pipeline,
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();
const path = {
    dist:{
        html:'dist',
        css:'dist/css',
        js:'dist/js',
        img : 'dist/img',
        ico: 'dist/favicon',
        self:'dist'
    },
    src : {
        html:'src/*.html',
        scss : 'src/scss/**/*.scss',
        js : 'src/js/*.js',
        img: 'src/img/**/**/*.*',
        ico: 'src/favicon/*.*',
    }
};
/**************** F U N C T I O N S ***************/
const htmlBuild = () => (
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.stream())
);
const scssBuild = () => (
    gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['> 0.01%', 'last 100 versions']))
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream())
);
const imgBuild = () => (
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream())
);
const jsBuild = () => (
    gulp.src(path.src.js)
        .pipe(concat('script.js'))
        .pipe(minify())
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.stream())
);
const cleanProd = () =>(
    gulp.src(path.dist.self, {allowEmpty: true})
        .pipe(cleaner())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(browserSync.stream())
);
const icoBuild = () => (
    gulp.src(path.src.ico)
        .pipe(gulp.dest(path.dist.ico))
        .pipe(browserSync.stream())
);
/****************** W A T C H E R ***************/
const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch(path.src.html, htmlBuild).on('change',browserSync.reload);
    gulp.watch(path.src.scss, scssBuild).on('change',browserSync.reload);
    gulp.watch(path.src.js, jsBuild).on('change',browserSync.reload);
    gulp.watch(path.src.img, imgBuild).on('change',browserSync.reload);
};
/**************** T A S K S ****************/
gulp.task('dev',gulp.series(
    scssBuild,
    jsBuild,
    watcher,
));

gulp.task('build',gulp.series(
    cleanProd,
    htmlBuild,
    imgBuild,
    icoBuild,
));

gulp.task('default',gulp.series(
    cleanProd,
    htmlBuild,
    scssBuild,
    imgBuild,
    jsBuild,
    icoBuild,
    watcher,
));