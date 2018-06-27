# 自动化构建
- 易于使用，通过代码优于配置的策略，自动化构建让简单的任务简单，复杂的任务可管理
- 构建快速，利用 Node.js 流的威力，你可以快速构建项目并减少频繁的 IO 操作
- 海量插件，严格的插件指南确保插件如你期望的那样简洁高质得工作

# 自动化构建工具
1. grunt 
2. gulp
3. webpack

# 环境配置
自动化构建都是基于 node 环境开发，所以先要配置 node 环境[传送门](https://github.com/dk-lan/nodejs/tree/master/module/base)

## gulp 使用
1. 全局安装 gulp `npm install --global gulp`
2. 初始化 `npm init`
3. 作为项目的开发依赖（devDependencies）安装 `npm install --save-dev gulp`
4. 在项目根目录下创建一个名为 gulpfile.js 的文件
```javascript
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```
4. 运行 gulp `gulp`

## gulp API
- `gulp.src(url)` 路径匹配
    - `gulp.src('./assets/*.js')` 匹配 assets 目录下所有 js 文件
    - `gulp.src('assets/**/*.js')` 匹配 assets 目录下所有目录的所有 js 文件
- `gulp.task(name, fn)` 定义一个任务
```javascript
gulp.task('somename', function() {
  // 做一些事
});
```
- 一个包含任务列表的数组，这些任务会在你当前任务运行之前完成
```javascript
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // 做一些事
});
```
- 接受一个 callback
```javascript
// 在 shell 中执行一个命令
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // 编译 Jekyll
    exec('jekyll build', function(err) {
        if (err) return cb(err); // 返回 error
        cb(); // 完成 task
    });
});
```
- 返回一个 stream
```javascript
gulp.task('somename', function() {
    var stream = gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
    return stream;
});
```
- 返回一个 promise
```javascript
var Q = require('q');

gulp.task('somename', function() {
    var deferred = Q.defer();

    // 执行异步的操作
    setTimeout(function() {
    deferred.resolve();
    }, 1);

    return deferred.promise;
});
```
## task 小结
- 默认的，task 将以最大的并发数执行，也就是说，gulp 会一次性运行所有的 task 并且不做任何等待
- 如果你想要创建一个序列化的 task 队列，并以特定的顺序执行，需要做两件事
    - 给出一个提示，来告知 task 什么时候执行完毕
    - 并且再给出一个提示，来告知一个 task 依赖另一个 task 的完成
```javascript
    var gulp = require('gulp');

    // 返回一个 callback，因此系统可以知道它什么时候完成
    gulp.task('one', function(cb) {
        // 做一些事 -- 异步的或者其他的
        cb(err); // 如果 err 不是 null 或 undefined，则会停止执行，且注意，这样代表执行失败了
    });

    // 定义一个所依赖的 task 必须在这个 task 执行之前完成
    gulp.task('two', ['one'], function() {
        // 'one' 完成后
    });

    gulp.task('default', ['one', 'two']);
```
- `gulp.watch(path, function(event){})` 监听路径下文件变化
```javascript
    gulp.watch('js/**/*.js', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    //event.type 发生的变动的类型：added, changed 或者 deleted
    //event.path 触发了该事件的文件的路径
```

## 开启本地服务 gulp-connect
1. 安装 gulp-connect `npm install gulp-connect --save-dev`
2. 定义任务
```javascript
var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('myServer', function() {
    connect.server({
        root: 'app',//服务启动的根目录
        port: 8000,//端口
        livereload: true//为true时gulp会自动检测文件的变化然后自动进行源码构建
    });
});
```
3. 启动任务 `gulp myServer`

## 压缩 js gulp-uglify
1. 安装 gulp-uglify `npm install gulp-uglify --save-dev`
2. 定义任务
```javascript
// 获取 gulp
var gulp = require('gulp');
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('jscompress', function() {
    // 1. 找到文件
   return gulp.src('js/1.js')
    // 2. 压缩文件
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'));
});
```
3. 启动任务 `gulp jscompress`
4. 添加自动监视任务
```javascript
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('js/1.js', ['jscompress']);
});
```
5. 设置默认任务（即命令行中输入gulp执行的任务）
```javascript
// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
gulp.task('default', ['auto']);
```

## 压缩CSS gulp-clean-css
1. 安装模块 `npm install gulp-clean-css --save-dev`
2. 定义任务
```javascript
// 获取 cleancss 模块（用于压缩 CSS）
var cleanCSS = require('gulp-clean-css');
// 压缩 css 文件
// 在命令行使用 gulp csscompress 启动此任务
gulp.task('csscompress', function() {
    // 1. 找到文件
  return  gulp.src('css/my.css')
    // 2. 压缩文件
        .pipe(cleanCSS())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/css'));
});
```
3. 添加对应的自动监视任务
```javascript
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('js/1.js', ['jscompress']);
    gulp.watch('css/my.css', ['csscompress']);
});
```
## 重命名文件 gulp-rename
1. 安装模块 `npm install gulp-rename --save-dev`
2. 定义任务
```javascript
// 获取 gulp
var gulp = require('gulp');
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
// 获取 cleancss 模块（用于压缩 CSS）
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
// 压缩 js 文件
// 在命令行使用 gulp jscompress 启动此任务
gulp.task('jscompress', function() {
    // 1. 找到文件
   return gulp.src('js/1.js')
       .pipe(rename({suffix: '.min'}))
    // 2. 压缩文件
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'));
});
// 压缩 css 文件
// 在命令行使用 gulp csscompress 启动此任务
gulp.task('csscompress', function() {
    // 1. 找到文件
   return gulp.src('css/my.css')
        .pipe(rename({suffix: '.min'}))
    // 2. 压缩文件
        .pipe(cleanCSS())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/css'));
});
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('js/1.js', ['jscompress']);
    gulp.watch('css/my.css', ['csscompress']);
});
// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
gulp.task('default', ['auto']);
```

## 编译 sass 
1. 安装模块 `npm install gulp-sass --save-dev`
2. 定义任务
```javascript
var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass111', function(){
  return gulp.src('app/scss/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});
```

## 编译 es6 
1. 安装模块 `npm install gulp-babel babel-preset-es2015 --save-dev`
2. 在项目根目录新建 babel 配置文件 .babelrc
```javascript
{
    "presets": ["es2015"]
}
```
3. 定义任务
```javascript
var gulp = require("gulp");
var babel = require("gulp-babel");    // 用于ES6转化ES5
var uglify = require('gulp-uglify'); // 用于压缩 JS

// ES6转化为ES5
// 在命令行使用 gulp toes5 启动此任务
gulp.task("toes5", function () {
  return gulp.src("src/js/**/*.js")// ES6 源码存放的路径
    .pipe(babel()) 
    .pipe(gulp.dest("dist")); //转换成 ES5 存放的路径
});

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('min', function() {
    // 1. 找到文件
    gulp.src('dist/*.js')
        // 2. 压缩文件
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('min/js'))
});

// 自动监控任务
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('src/js/**/*.js', ['toes5']);
    gulp.watch('dist/*.js', ['min']);

});
```