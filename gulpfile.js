var gulp = require("gulp")
var gulp_if = require("gulp-if")
var gulp_util = require("gulp-util")
var gulp_uglify = require("gulp-uglify")
var gulp_connect = require("gulp-connect")
var gulp_minify_css = require("gulp-minify-css")
var gulp_minify_html = require("gulp-minify-html")
var gulp_json_transform = require("gulp-json-transform")

var del = require("del")
var yargs = require("yargs")
var chalk = require("chalk")
var vinyl_buffer = require("vinyl-buffer")
var vinyl_source = require("vinyl-source-stream")

var browserify = require("browserify")
var aliasify = require("aliasify")

var SOURCE_DIRECTORY = "./source"
var BUILD_DIRECTORY = "./build"

gulp.task("scripts", function()
{
    browserify(SOURCE_DIRECTORY + "/index.js")
        .transform(aliasify.configure({
            configDir: __dirname,
            aliases: {
                "<source>": SOURCE_DIRECTORY
            }
        }))
        .bundle()
        .on('error', handleErrorMessage)
        .pipe(vinyl_source("index.js")).pipe(vinyl_buffer())
        .pipe(gulp_if(yargs.argv.compiled, gulp_uglify()))
        .pipe(gulp.dest(BUILD_DIRECTORY))
        .pipe(gulp_connect.reload())
})

gulp.task("markup", function()
{
    gulp.src(SOURCE_DIRECTORY + "/index.html")
        .pipe(gulp_if(yargs.argv.compiled, gulp_minify_html()))
        .pipe(gulp.dest(BUILD_DIRECTORY))
        .pipe(gulp_connect.reload())
})

gulp.task("configs", function()
{
    gulp.src("./package.json")
        .pipe(gulp_json_transform(function(data) {
            delete data["devDependencies"]
            delete data["dependencies"]
            return data
        }, 2))
        .pipe(gulp.dest(BUILD_DIRECTORY))
})

gulp.task("default", function()
{
    del([BUILD_DIRECTORY], function() {
        gulp.start(["markup", "scripts", "configs"])
    })
})

gulp.task("watch", ["default"], function()
{
    gulp_connect.server({
        root: BUILD_DIRECTORY,
        livereload: true
    })

    gulp.watch(SOURCE_DIRECTORY + "/**/*.js", ["scripts"])
    gulp.watch(SOURCE_DIRECTORY + "/index.html", ["markup"])
    gulp.watch("./package.json", ["configs"])
})

function handleErrorMessage(error)
{
    gulp_util.log(chalk.bold.red(error.message))
    gulp_util.beep()
}
