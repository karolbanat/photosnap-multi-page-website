const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const fancy_log = require('fancy-log');

const paths = {
	sass: './src/sass/**/*.scss',
	ts: './src/ts/**/*.ts',
	assets: './src/assets/**/*',
	tsEntry: './src/ts/main.ts',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
	assetsDest: './dist/assets',
};

function sassCompiler(done) {
	const postcssPlugins = [autoprefixer(), cssnano()];
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(postcssPlugins))
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest));
	done();
}

function typeScript(done) {
	tsProject
		.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.on('error', fancy_log)
		.js.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
	done();
}

function minifyImages(done) {
	src(paths.assets).pipe(imagemin()).pipe(dest(paths.assetsDest));
	done();
}

function cleanStuff(done) {
	src(paths.dist, { read: false }).pipe(clean());
	done();
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
		browser: ['chrome', 'firefox'],
	});
	done();
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload);
	watch([paths.sass, paths.ts, paths.assets], parallel(sassCompiler, typeScript, minifyImages)).on('change', reload);
	done();
}

exports.cleanStuff = cleanStuff;
const mainFunctions = parallel(sassCompiler, typeScript, minifyImages);
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
