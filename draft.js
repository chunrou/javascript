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
    return new Promise(function(resolve, reject){  
        window.setTimeout(function(){
            resolve(1);  
        }, 1000)
      });
  }).then(function(value){              //第四个then  
    console.log(value);  
    return Promise.reject('reject');  
  }).then(function(value){              //第五个then  
    console.log('resolve: '+ value);  
  }, function(err){  
    console.log('reject: ' + err);  
  })  