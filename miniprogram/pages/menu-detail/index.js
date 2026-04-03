Page({
  data: {
    menu: {},
    loading: true
  },

  onLoad: function (options) {
    const { id } = options;
    if (id) {
      this.loadMenuDetail(id);
    }
  },

  loadMenuDetail: function (id) {
    const app = getApp();
    
    // 使用微信小程序专用 API（返回 HTML 格式内容）
    app.wechatRequest(`/home-menus/${id}`)
      .then(res => {
        this.setData({
          menu: res,
          loading: false
        });

        // 设置页面标题
        wx.setNavigationBarTitle({
          title: res.title || '菜单详情'
        });
      })
      .catch(error => {
        console.error('加载菜单详情失败:', error);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
        this.setData({
          loading: false
        });
      });
  }
});