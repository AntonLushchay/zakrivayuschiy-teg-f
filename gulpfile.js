const { src, dest, watch, parallel, series } = require('gulp');

const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

const gulpPug = require('gulp-pug');
const scss = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify-es').default;
const del = require('del');

// const squoosh = require('gulp-libsquoosh');
// const newer = require('gulp-newer');

function pug() {
    return src('src/pages/**/*.pug')
        .pipe(gulpPug({ pretty: true }))
        .pipe(concat('bundle.html'))
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

function scssToCss() {
    return src('src/**/*.scss')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(autoprefixer())
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
    return src('src/**/*.js')
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

// function images() {
//     return src('./src/images/src/*.{png,jpg}')
//         .pipe(
//             squoosh({
//                 encodeOptions: {
//                     png: { optimize: true }, // Сжатие PNG
//                     jpg: { optimize: true }, // Сжатие JPG
//                     webp: { quality: 85 }, // Качество WebP
//                     avif: { level: 6 }, // Уровень сжатия AVIF
//                 },
//                 output: '[ext]', // Сохранять расширение исходного файла
//             })
//         )
//         .pipe(dest('./dist/images'));
// }

function clean() {
    return del('dist');
}

function watchFiles() {
    browserSync.init({
        server: {
            baseDir: 'dist/',
            index: 'bundle.html',
        },
    });
    watch(['src/pages/**/*.pug'], pug);
    watch(['src/**/*.scss'], scssToCss);
    watch(['src/**/*.js'], scripts);
}

const build = series(clean, parallel(pug, scssToCss, scripts));

exports.pug = pug;
exports.scssToCss = scssToCss;
exports.scripts = scripts;
// exports.newer = newer;
// exports.images = images;
exports.watchFiles = watchFiles;
exports.clean = clean;
exports.build = build;
exports.default = series(build, watchFiles);
