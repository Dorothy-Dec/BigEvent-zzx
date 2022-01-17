$(function () {
  let layer = layui.layer
  let form = layui.form

  initArticleList()

  // 获取文章分类列表
  function initArticleList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        let str = template('telList', res) //注意：不需要加#
        $('tbody').html(str)
      }
    })
  }


  // 添加类别--弹窗
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog_add').html()
    });
  })

  // 确认添加---通过委托的形式(因为表单是动态添加的)
  $('body').on('submit', '#form_add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加文章分类失败！')
        }
        // 重新渲染列表
        initArticleList()
        layer.msg('添加文章分类成功！')
        // 根据索引关闭弹出层
        layer.close(indexAdd)
      }
    })
  })


  // 编辑按钮
  let indexEdit = null
  $('tbody').on('click','#btn_edit',function(){
    // 出现弹窗
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog_edit').html()
    });

    // 表单回显
    let id= $(this).attr('data-id')
    $.ajax({
      method:'GET',
      url:'/my/article/cates/'+id,
      success:function(res){
        if (res.status !== 0) {
          return layer.msg('编辑文章分类失败！')
        }
        // 快速为表单赋值--结构还要写 lay-filter
        form.val('form_edit',res.data) 
      }
    })
  })

  // 更新修改--事件委托实现
  $('body').on('submit','#form_edit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/updatecate',
      data:$(this).serialize(),
      success:function(res){
        if (res.status !== 0) {
          return layer.msg('更新文章分类失败！')
        }
        layer.msg('更新文章分类成功！')
        layer.close(indexEdit)
        initArticleList()
      }
    })
  })

  // 删除
  $('tbody').on('click','#btn_delete',function(){
    let id = $(this).attr('data-id')
    // 出现弹窗
     layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/'+ id,
        success:function(res){
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败！')
          }
          $(this).parents('tr').remove()
          layer.msg('删除成功！')
          initArticleList()
        }
      })
      layer.close(index);
    });


    


    
    
  })
})