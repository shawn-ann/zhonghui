// search.js
const app = getApp();

Page({
  data: {
    articles: [],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true,
    keyword: ''
  },

  onLoad(options) {
    console.log('Search page onLoad options:', options);
    if (options.keyword) {
      console.log('Received keyword:', options.keyword);
      // 解码 URL 编码的关键词
      const decodedKeyword = decodeURIComponent(options.keyword);
      console.log('Decoded keyword:', decodedKeyword);
      this.setData({
        keyword: decodedKeyword
      });
      // 重置页码
      this.setData({ page: 1 });
      this.fetchArticles();
    }
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.fetchArticles();
    }
  },

  // 获取文章列表（带分页）
  fetchArticles() {
    const { page, pageSize, articles, keyword } = this.data;

    this.setData({ loading: true });

    // 构建请求URL，不指定文章类型，同时搜索案例和QA
    let url = `/articles?page=${page}&pageSize=${pageSize}`;
    
    // 添加关键词搜索
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    console.log('Fetching articles with URL:', url);
    console.log('Keyword:', keyword);
    
    // 使用小程序专用接口，返回HTML内容
    app.wechatRequest(url)
      .then(res => {
        // 处理返回的数据结构
        const articleData = Array.isArray(res) ? res : [];
        // 格式化数据
        const formattedArticles = articleData.map(item => {
          // 格式化日期
          let formattedDate = '';
          if (item.publish_date) {
            const date = new Date(item.publish_date);
            formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          }
          
          return {
            ...item,
            image_url: item.image_url ? app.globalData.apiBaseUrl.replace('/api', '') + item.image_url : '',
            publish_date: formattedDate
          };
        });
        
        // 合并数据
        const newArticles = page === 1 ? formattedArticles : [...articles, ...formattedArticles];
        
        this.setData({
          articles: newArticles,
          page: page + 1,
          loading: false,
          hasMore: formattedArticles.length === pageSize
        });
      })
      .catch(err => {
        console.error('Failed to fetch articles:', err);
        this.setData({ loading: false });
      });
  },

  // 导航到文章详情
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/article-detail/index?id=${id}`
    });
  }
});