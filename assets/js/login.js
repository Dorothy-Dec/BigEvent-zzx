$(function () {
  // 点击'去注册'--跳转到注册页面
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击'去登录'--跳转到登录页面
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  let form = layui.form
  let layer = layui.layer

  // 自定义校验规则---layui方法，用就行
  form.verify({
    // 密码校验
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 确认密码校验
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form-reg').on('submit', function (e) {
    e.preventDefault()
    let data = {
      // 属性选择器
      username: $('#form-reg [name=username]').val(),
      password: $('#form-reg [name=password]').val()
    }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功,请登录')
      // 手动触发点击事件 --成功就跳转到登录界面
      $('#link_login').click()
    })
  })

  // 登录表单提交事件
  $('#form_log').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      url:'/api/login',
      method:'POST',
      data: $(this).serialize(),  //获取当前表单（登录界面的用户名和密码）的所有数据
      success:function(res){
        if(res.status !== 0){
          return layer.msg('登录失败');
        }
        layer.msg('登录成功')
        // 将登录成功的token字符串，保存到localStorage中
        // ---只要成功登录了，就会生成一个token，把它先保存到本地存储，方便后面进行身份认证的判断
        localStorage.setItem('token',res.token)
        // 跳转到后台主页
        location.href = '/code/index.html'
      }
    })
  })









})