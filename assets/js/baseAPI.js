// JQuary 的一种语法：每次发起ajax请求时都调用这个函数，将url修改成让如下的样式
$.ajaxPrefilter(function (options) {
  options.url = 'http://www.liulongbin.top:3007' + options.url
  // 统一设置 headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 统一设置 不论请求是否成功都执行的回调函数
  options.complete = function(res){
    if(res.responseJSON.status ===1 && res.responseJSON.message === "身份认证失败！"){
      localStorage.removeItem('token')
      location.href = '/code/login.html'
    }
  }




})