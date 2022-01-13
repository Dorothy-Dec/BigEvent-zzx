// JQuary 的一种语法：每次发起ajax请求时都调用这个函数，将url修改成让如下的样式
$.ajaxPrefilter(function(options){
  options.url = 'http://www.liulongbin.top:3007'+ options.url
})