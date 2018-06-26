require.config({
    paths : {
        "jquery" : ["https://cdn.bootcss.com/jquery/3.3.1/jquery.min"],
        "a" : "a"   
    }
})
require(["jquery","a"],function($, a){
    $(function(){
        // a()
    })
})