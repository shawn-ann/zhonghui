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
    
    app.request(`/home-menus/${id}`)
      .then(res => {
        // 处理 content 转换为 HTML
        let contentHtml = res.content || '';
        if (contentHtml && contentHtml.startsWith('{')) {
          try {
            const delta = JSON.parse(contentHtml);
            // 简单的 Delta 转 HTML（实际可用 quill-delta-to-html 库）
            contentHtml = this.convertDeltaToHtml(delta);
          } catch (e) {
            // 如果解析失败，原样返回
          }
        }

        this.setData({
          menu: {
            ...res,
            content: contentHtml
          },
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
  },

  // 简单的 Delta 转 HTML
  convertDeltaToHtml: function (delta) {
    if (!delta || !delta.ops) return '';
    
    let html = '';
    delta.ops.forEach(op => {
      if (op.insert) {
        if (typeof op.insert === 'string') {
          let text = op.insert;
          // 处理换行
          text = text.replace(/\n/g, '<br>');
          // 处理加粗
          if (op.attributes && op.attributes.bold) {
            text = `<strong>${text}</strong>`;
          }
          // 处理斜体
          if (op.attributes && op.attributes.italic) {
            text = `<em>${text}</em>`;
          }
          html += text;
        } else if (op.insert.image) {
          // 处理图片
          const imgUrl = op.insert.image;
          html += `<img src="${imgUrl}" style="max-width:100%;height:auto;" />`;
        }
      }
    });
    
    return html;
  }
});