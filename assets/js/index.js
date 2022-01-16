$(function () {

  // 获取用户信息和渲染出来
  getUserInfo()

  let layer = layui.layer
  // 退出
  $('#btnLogout').on('click', function () {
    // 弹窗
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 清除本地存储的token
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = '/code/login.html'
      layer.close(index);
    });
  })



})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // console.log(res);
      renderAvatar(res.data)
    }
    // 统一的headers 和 copmlete  放在了baseAPI 里
  })
}

// 渲染头像和用户姓名
function renderAvatar(user) {
  let name = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
    $('.layui-nav-img').hide()
  }
}