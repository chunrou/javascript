## 异步问题
### 简单异步问题
在JavaScript的世界中，所有代码都是单线程执行的，由于这个“缺陷”，导致JavaScript的所有网络操作，浏览器事件，都必须是异步执行。异步执行可以用回调函数实现
```javascript
    window.setTimeout(function(){
        console.log(123)
    }, 1000)
```
同样异步问题会出现在 Ajax 请求当中
```javascript
    $.ajax({
        url: '',
        success: function(res){
            generateTable(res.data);
        }
    })

    function generateTable(data){
        console.log(data);
    }
```

### 复杂异步问题
在很多开发场景当中会有比较多的请求需要按顺序串行执行，比如有 `var apis = ['api1', 'api2', 'api3']`，需求是需要按顺序执行，先完成请求一再发起请求二然后再是请求三，这个时候用 Ajax 请求就只能是回调嵌套回调
```javascript
    $.ajax({
        url: 'api1',
        success: function(res){
            $.ajax({
                url: 'api2',
                success: function(res){
                    $.ajax({
                        url: 'api3',
                        success: function(res){
                            generateTable(res.data);
                        }
                    })
                }
            })
        }
    })

    function generateTable(data){
        console.log(data);
    }
```
以上的解决方案可行，但如何 api 有 n 个，那这种无多层嵌套的方式我们称之为回调地狱

## Promise
为了解决上述回调地狱问题，便推出了 Promise 并在 ES6 中被统一规范，由浏览器直接支持。
### Promise 简单使用
Promise 是一个构造函数，接收一个 function 为参数，该回调函数有会被传两个形参 resolve 和 reject，resolve 用于执行正常结果，并用 then 来接收
```javascript
    var p1 = new Promise(function(resolve, reject){
        window.setTimeout(function(){
            resolve(123)
        }, 1000);
    })

    p1.then(function(res){
        console.log(res)
    })
```
用 reject 用来执行异常结果。用 catch 来获取异常信息
```javascript
    var p1 = new Promise(function(resolve, reject){
        window.setTimeout(function(){
            reject('error')
        }, 1000);
    })

    p1.then(function(res){
        console.log(res)
    }).catch(function(error){
        console.log(error)
    })
```

### 状态不可逆性、链式调用(串行调用)
如上述如何有多个异步需要串行执行，用 Promise 实现会简单很多
```javascript
var p = new Promise(function(resolve, reject){  
    window.setTimeout(function(){
        resolve(1);  
    }, 1000)
  });  
  p.then(function(value){               //第一个then  
    console.log(value);  
    return value*2;  
  }).then(function(value){              //第二个then  
    console.log(value);  
  }).then(function(value){              //第三个then  
    console.log(value);  
    return Promise.resolve('resolve');   
  }).then(function(value){              //第四个then  
    console.log(value);  
    return Promise.reject('reject');  
  }).then(function(value){              //第五个then  
    console.log('resolve: '+ value);  
  }, function(err){  
    console.log('reject: ' + err);  
  })  
```

### 小结
1. 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态
    - pending: 初始状态，不是成功或失败状态
    - fulfilled: 意味着操作成功完成
    - rejected: 意味着操作失败
2. Promise 对象的状态改变，只有两种可能：从 Pending 变为 Resolved 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了。
```javascript
new Promise(function(resolve, reject){
    window.setTimeout(function(){
        reject('error')
    }, 2000)
 
    window.setTimeout(function(){
        resolve('ok')
    }, 3000)


}).then(function(res){
    console.log(res)
}).catch(function(error){
    console.log(error)
})
```
3. 优点：有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。
4. 缺点: 
    - 首先，无法取消 Promise，一旦新建它就会立即执行，无法中途取消.
    - 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部
    - 当处于 Pending 状态时，无法得知目前进展到哪一个阶段

5. 规范
    - Pending – Promise对象的初始状态，等到任务的完成或者被拒绝；Resolved – 任务执行完成并且成功的状态；Rejected – 任务执行完成并且失败的状态；
    - Promise的状态只可能从Pending状态转到Resolved状态或者Rejected状态，而且不能逆向转换，同时Resolved状态和Rejected状态也不能相互转换；
    - Promise对象必须实现then方法，then是promise规范的核心，而且then方法也必须返回一个Promise对象，同一个Promise对象可以注册多个then方法，并且回调的执行顺序跟它们的注册顺序一致；
    - then方法接受两个回调函数，它们分别为：成功时的回调和失败时的回调；并且它们分别在：Promise由Pending状态转换到Resolved状态时被调用和在Promise由Pending状态转换到Rejected状态时被调用。

### Promise.all
有时候需要使用并行执行时可以用 Promise.all，then 返回的时间以最后一个异步执行的完成时间为准。
```javascript
    var promise1 = Promise.resolve(3);
    var promise2 = 42;
    var promise3 = new Promise(function(resolve, reject) {
        setTimeout(resolve, 2000);
    });

    Promise.all([promise1, promise2, promise3]).then(function(values) {
        console.log(values);
    });
```