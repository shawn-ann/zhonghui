// detail.js
const app = getApp();

Page({
  data: {
    caseStudy: {},
    loading: true
  },

  onLoad: function (options) {
    const { id } = options;
    if (id) {
      this.loadCaseStudyDetail(id);
    }
  },

  loadCaseStudyDetail: function (id) {
    const endpoint = `/case-studies/${id}`;
    
    app.wechatRequest(endpoint)
      .then(res => {
        // 格式化日期为年月日 时分秒格式
        let formattedDate = '';
        if (res.publish_date) {
          const date = new Date(res.publish_date);
          // 使用本地时间方法获取时间，确保显示正确的服务器时间
          formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        }
        
        // 处理图片 URL
        let imageUrl = res.image_url;
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = app.globalData.apiBaseUrl.replace('/api', '') + imageUrl;
        }
        
        this.setData({
          caseStudy: {
            ...res,
            publish_date: formattedDate,
            image_url: imageUrl
          },
          loading: false
        });
        
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: res.title
        });
      })
      .catch(error => {
        console.error('加载案例详情失败:', error);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
        this.setData({
          caseStudy: {
            title: "案例分享详情",
            content: "<p>文章内容加载中...</p>",
            image_url: "https://via.placeholder.com/300x200?text=Case",
            publish_date: "2026年3月17日 12:00:00",
            view_count: 100
          },
          loading: false
        });
      });
  }
});