$(function () {

  let layer = layui.layer
  let form = layui.form

  initCate()

  // 初始化富文本编辑器
  initEditor()

  // 加载文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败！')
        }
        let str = template('tel_search', res)
        $('#cate_id').html(str)
        //一定不要忘记用render渲染页面
        form.render()
      }
    })
  }



  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 选择封面--点击
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 选择封面文件
  $('#coverFile').on('change', function (e) {
    let fileList = e.target.files
    if (fileList.length === 0) {
      return layer.msg('请选择图片！')
    }
    let file = fileList[0]
    var newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义一个统一的状态，点击草稿时状态是草稿，不点击时就是已发布
  let art_state = '已发布'

  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })


  // 提交事件
  $('#form_pub').on('submit', function (e) {
    e.preventDefault()
    // 快速获取到表单中的数据
    // let fd = new FormData($(this)[0])
    let fd = new FormData(this)
    // console.log(fd);

    fd.append('state', art_state)


    $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      fd.append('cover_img', blob)
      // 请求数据、发布文章
      publishArticle(fd)
    })

    // 发布文章
    function publishArticle(fd) {
      $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('发布文章失败！')
          }
          layer.msg('发布文章成功！')
          location.href = '/code/article/art_list.html'
        }
      })
    }

  })

})