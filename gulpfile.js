var gulp = require("gulp")
var gulp_if = require("gulp-if")
var gulp_util = require("gulp-util")
var gulp_uglify = require("gulp-uglify")
var gulp_connect = require("gulp-connect")
var gulp_minify_css = require("gulp-minify-css")
var gulp_minify_html = require("gulp-minify-html")
var gulp_prefixify_css = require("gulp-autoprefixer")
var gulp_json_transform = require("gulp-json-transform")

var del = require("del")
var yargs = require("yargs")
var chalk = require("chalk")
var vinyl_buffer = require("vinyl-buffer")
var vinyl_source = require("vinyl-source-stream")

var browserify = require("browserify")
var aliasify = require("aliasify")

var INPUT_DIRECTORY = "./source"
var OUTPUT_DIRECTORY = "./build"

gulp.task("markup", function() {
    gulp.src(INPUT_DIRECTORY + "/index.html")
        .pipe(gulp_if(yargs.argv.minify, gulp_minify_html()))
        .pipe(gulp.dest(OUTPUT_DIRECTORY))
        .pipe(gulp_connect.reload())
})

gulp.task("scripts", function() {
    browserify(INPUT_DIRECTORY + "/index.js")
        .transform(aliasify.configure({
            configDir: __dirname,
            aliases: {
                "<source>": INPUT_DIRECTORY
            }
        }))
        .bundle()
        .on('error', handleErrorMessage)
        .pipe(vinyl_source("index.js")).pipe(vinyl_buffer())
        .pipe(gulp_if(yargs.argv.minify, gulp_uglify()))
        .pipe(gulp.dest(OUTPUT_DIRECTORY))
        .pipe(gulp_connect.reload())
})

gulp.task("styles", function() {
    gulp.src(INPUT_DIRECTORY + "/index.css")
        .pipe(gulp_prefixify_css())
        .on("error", handleErrorMessage)
        .pipe(gulp_if(yargs.argv.minify, gulp_minify_css()))
        .pipe(gulp.dest(OUTPUT_DIRECTORY))
        .pipe(gulp_connect.reload())
})

gulp.task("assets", function() {
    gulp.src(INPUT_DIRECTORY + "/assets/**/*", {base: INPUT_DIRECTORY})
        .pipe(gulp.dest(OUTPUT_DIRECTORY))
        .pipe(gulp_connect.reload())
})

gulp.task("configs", function() {
    gulp.src("./package.json")
        .pipe(gulp_json_transform(function(data) {
            delete data["devDependencies"]
            delete data["dependencies"]
            return data
        }, 2))
        .pipe(gulp.dest(OUTPUT_DIRECTORY))
})

gulp.task("default", function() {
    del([OUTPUT_DIRECTORY], function() {
        gulp.start([
            "markup",
            "scripts",
            "styles",
            "assets",
            "configs"
        ])
    })
})

gulp.task("watch", ["default"], function() {
    gulp_connect.server({
        root: OUTPUT_DIRECTORY,
        livereload: true
    })

    gulp.watch(INPUT_DIRECTORY + "/**/*.html", ["markup"])
    gulp.watch(INPUT_DIRECTORY + "/**/*.js", ["scripts"])
    gulp.watch(INPUT_DIRECTORY + "/**/*.css", ["styles"])
    gulp.watch(INPUT_DIRECTORY + "/assets/**/*", ["assets"])
    gulp.watch("./package.json", ["configs"])
})

function handleErrorMessage(error) {
    gulp_util.log(chalk.bold.red(error.message))
    gulp_util.beep()
}
