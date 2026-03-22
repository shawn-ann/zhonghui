// detail.js
const app = getApp();

Page({
  data: {
    article: {
      title: '',
      content: '',
      image_url: '',
      publish_date: '',
      view_count: 0
    }
  },

  onLoad(options) {
    const { id, type } = options;
    this.setData({
      id,
      type
    });
    this.fetchArticleDetails();
  },

  // 获取文章详情
  fetchArticleDetails() {
    const { id, type } = this.data;
    // 案例分享使用小程序专用接口，返回HTML内容
    const endpoint = type === 'case' ? `/case-studies/${id}` : `/qa-articles/${id}`;
    const requestMethod = type === 'case' ? app.wechatRequest(endpoint) : app.request(endpoint);
    
    requestMethod
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
          article: {
            ...res,
            publish_date: formattedDate,
            image_url: imageUrl
          }
        });
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: res.title
        });
      })
      .catch(err => {
        console.error('Failed to fetch article details:', err);
        // 使用默认数据
        this.setData({
          article: {
            title: type === 'case' ? "案例分享详情" : "问答文章详情",
            content: "<p>文章内容加载中...</p>",
            image_url: `https://via.placeholder.com/300x200?text=${type === 'case' ? 'Case' : 'QA'}`,
            publish_date: "2026年3月17日 12:00:00",
            view_count: 100
          }
        });
      });
  }
})