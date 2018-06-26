https://www.cnblogs.com/HCJJ/p/6611669.html

## 模块化
在 javascript 编程中，把每个功能单独封装起来，可以把这个封装称之为模块。

## requirejs
是用来封装 javascript 模块的一个工具库，也可以将之称为 javascript 模块化工具

## 简单使用
#### a.js
```javascript
function fun1(){
  alert("it works");
}

fun1();
```
#### index.html
```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="a.js"></script>
    </head>
    <body>
      <h1>Tom</h1>
    </body>
</html>
```
当在浏览器渲染 html 页面时，会先 alert，点确定后后再显示 DOM 结构，这种行为就是JS阻塞浏览器渲染。然后把代码小做修改：
#### a.js
```javascript
define(function(){
    function fun1(){
      alert("it works");
    }

    fun1();
})
```
#### index.html
```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="require.js"></script>
        <script type="text/javascript">
            require(["a"]);
        </script>
    </head>
    <body>
      <h1>Tom</h1>
    </body>
</html>
```
然后会发现在 alert 后没有点确定前，DOM 结构依然可以正常显示。

## 优点
以上案例能说明 requirejs 的优点有两点：
1. 防止js加载阻塞页面渲染
2. 按需调用模块

## API
require会定义三个变量：define,require,requirejs，其中require === requirejs，一般使用require更简短
1. define 从名字就可以看出这个api是用来定义一个模块
2. require 加载依赖模块，并执行加载完后的回调函数

### 定义模块
```javascript
define(function(){
    function fun1(){
      alert("it works");
    }

    fun1();
})
```

### 调用模块
```javascript
require(["js/a"]);
```

### 配置信息
利用 `require.config` 来配置文件信息
#### a.js
```javascript
define(function(){
  function fun1(){
    alert("it works");
  }
  return fun1;
})
```
#### main.js
```javascript
require.config({
    paths : {
        “baseUrl”: '',
        "jquery" : ["https://cdn.bootcss.com/jquery/3.3.1/jquery.min"],
        "a" : "a"   
    }
})
require(["jquery","a"],function($, a){
    $(function(){
        a()
    })
})
```
#### index.html
```html
<script type="text/javascript" src="./require.js" data-main="main"></script>
```

## 小结
1. 在使用 requirejs 时，加载模块时不用写.js后缀的，当然也是不能写后缀
2. require.config 是用来配置模块加载位置，简单点说就是给模块起一个更短更好记的名字
3. 通过paths的配置会使我们的模块名字更精炼，paths还有一个重要的功能，就是可以配置多个路径，如果远程cdn库没有加载成功，可以加载本地的库
4. 加载requirejs脚本的script标签加入了data-main属性，这个属性指定的js将在加载完reuqire.js后处理，我们把require.config的配置加入到data-main后