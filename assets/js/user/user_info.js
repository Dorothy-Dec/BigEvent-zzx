$(function () {

  let form = layui.form
  let layer = layui.layer

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  
  initUserInfo()

  // 初始化用户基本信息
  function initUserInfo(){
    $.ajax({
      method:'GET',
      url:'/my/userinfo',
      success:function(res){
        if(res.status !== 0){
          return layer.msg('获取用户信息失败！')
        }
        // 为表单快速赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置按钮
  $('#btnReset').on('click',function(e){
    e.preventDefault()
    initUserInfo()
  })

  // 提交修改---提交事件！！！！！！！！！！！！！！！！！
  $('.layui-form').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/userinfo',
      data:$(this).serialize(),
      success:function(res){
        if(res.status !==0){
          return layer.msg('用户修改信息失败！')
        }
        layer.msg('更新信息成功！')
        // iframe 可以使用外面最近一层父页面的方法
        window.parent.getUserInfo()
        // console.log(res);
      }
    })

  })








})

