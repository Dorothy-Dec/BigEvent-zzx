$(function () {

  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage
  let hasrow = null;

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  let q = {
    // 里面的是分页参数
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }


  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)
    let y = String(dt.getFullYear())
    let m = String(dt.getMonth() + 1).padStart(2, '0')
    let d = String(dt.getDate()).padStart(2, '0')

    let hh = String(dt.getHours()).padStart(2, '0')
    let mm = String(dt.getMinutes()).padStart(2, '0')
    let ss = String(dt.getSeconds()).padStart(2, '0')

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

  }

  initTable()
  initCate()


  // 获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',   //获取文章列表
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        hasrow = res.data.length   //获取到的是当前本页的数据长度（2条、3条等）
        // console.log(res);
        let str = template('tel_table', res)
        $('tbody').html(str)
        // 渲染分页
        renderPage(res.total)
      }
    })
  }


  // 初始化文章分类方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',  //获取文章分类列表
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        let str = template('tpl-cate', res)
        $('[name=cate_id]').html(str)
        // 通过layui重新渲染表单区域的ui结构
        // 页面可视菜单不是原生的，没办法出现下拉，所以调用render方法设置一个隐藏的select表单实现真正的下拉
        form.render()
      }
    })
  }


  // 筛选--修改q的值，再重新渲染
  $('#form_select').on('submit', function (e) {
    e.preventDefault()
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  // 渲染分页
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id，不用加 # 号
      count: total,//总数据条数
      limit: q.pagesize,// 每页显示几条数据
      curr: q.pagenum,   // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],

      // 分页发生切换时，触发jump回调
      jump: function (obj, first) {
        // console.log(obj.curr);
        // 拿到最新页码值
        q.pagenum = obj.curr
        // 更新最新条目数
        q.pagesize = obj.limit


        // 触发 jump 回调的方式有两种：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调


        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果 first 的值为 true，证明是方式2（调用render）触发的
        // 否则就是方式1（点击页码）触发的

        // 首次不执行！！
        if (!first) {
          initTable()  //如果不判断就一直在进行死循环
        }

      }
    });
  }
  // 设置默认被选中的分页

  // 删除
  $('tbody').on('click', '#btn_delete', function () {
    let id = $(this).attr('data-id')
    // 出现弹窗
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章列表失败！')
          }
          // 当前页面只有一条数据时，将页码减一，再重新渲染（不执行这个操作，就会出现本页删除完成后，页码变化，但是页面为空）
          if (hasrow === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    });
  })





})