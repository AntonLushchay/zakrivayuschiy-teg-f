const { src, dest, watch, parallel, series } = require('gulp');

const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// const htmlMinify = require('html-minifier');
// function html() {
//     const options = {
//         removeComments: true,
//         removeRedundantAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         sortClassName: true,
//         useShortDoctype: true,
//         collapseWhitespace: true,
//         minifyCSS: true,
//         keepClosingSlash: true,
//     };
//     return src('src/**/*.html')
//         .pipe(plumber())
//         .on('data', function (file) {
//             const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options));
//             return (file.contents = buferFile);
//         })
//         .pipe(dest('dist/'))
//         .pipe(browserSync.reload({ stream: true }));
// }

const gulpPug = require('gulp-pug');
function pug() {
    return src('src/pages/**/*.pug')
        .pipe(gulpPug({ pretty: true }))
        .pipe(concat('bundle.html'))
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

const scss = require('gulp-sass')(require('sass'));
function scssToCss() {
    return src('src/**/*.scss')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(autoprefixer())
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

const uglify = require('gulp-uglify-es').default;
function scripts() {
    return src('src/**/*.js')
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

const del = require('del');
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
    // watch(['src/**/*.html'], html);
    watch(['src/pages/**/*.pug'], pug);
    watch(['src/**/*.scss'], scssToCss);
    watch(['src/**/*.js'], scripts);
}

const build = series(clean, parallel(pug, scssToCss, scripts));

// exports.html = html;
exports.pug = pug;
exports.scssToCss = scssToCss;
exports.scripts = scripts;
exports.watchFiles = watchFiles;
exports.clean = clean;
exports.build = build;
exports.default = series(build, watchFiles);
