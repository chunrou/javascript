//定义依赖和插件
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect');//livereload
    var sass = require('gulp-sass');
    var mincss = require('gulp-clean-css');
    
var amdOptimize = require("amd-optimize"); 
   
var jsSrc = 'src/js/*.js';
var jsDist = 'dist/js';

var htmlSrc = 'src/*.html';
var htmlDist = 'dist';

//定义名为js的任务
gulp.task('js', function () {

    gulp.src(jsSrc)
        // .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDist))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(uglify())
        // .pipe(gulp.dest(jsDist))
        .pipe(connect.reload())

});

gulp.task('rjs', function () {
    gulp.src('./src/js/*.js')
        .pipe(amdOptimize("main", {
            paths: {
                "a": "./src/js/a",
                "b": "./src/js/b"
            }
        }))
        .pipe(concat("index.js"))           //合并
        .pipe(gulp.dest("dist/js"))          //输出保存
        .pipe(rename("index.min.js"))          //重命名
        .pipe(uglify())                        //压缩
        .pipe(gulp.dest("dist/js"));         //输出保存

    });

gulp.task('sass', function(){
  return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(mincss())
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
});

//定义html任务
gulp.task('html', function () {

    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDist))
        .pipe(connect.reload());

});

//定义livereload任务
gulp.task('connect', function () {
    connect.server({
        livereload: true
    });
});



//定义看守任务
gulp.task('watch', function () {

    gulp.watch('src/*.html', ['html']);

    gulp.watch('src/js/*.js', ['rjs']);

    gulp.watch('src/scss/*.scss', ['sass']);
});


//定义默认任务
gulp.task('default', [ 'rjs', 'html', 'sass','watch', 'connect']);
