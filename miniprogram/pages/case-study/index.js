// list.js
const app = getApp();

Page({
  data: {
    caseStudies: [],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true,
    keyword: '',
    isSearch: false,
    type: 'case' // case, qa, search
  },

  onLoad(options) {
    if (options.keyword) {
      this.setData({
        keyword: options.keyword,
        isSearch: true,
        type: 'search'
      });
      // 重置页码
      this.setData({ page: 1 });
    } else if (options.type) {
      this.setData({
        type: options.type
      });
      // 重置页码
      this.setData({ page: 1 });
    }
    this.fetchCaseStudies();
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.fetchCaseStudies();
    }
  },

  // 获取文章列表（带分页）
  fetchCaseStudies() {
    const { page, pageSize, caseStudies, keyword, type } = this.data;

    this.setData({ loading: true });

    // 构建请求URL
    let url = `/articles?page=${page}&pageSize=${pageSize}`;
    
    // 根据类型设置文章类型参数
    if (type === 'case' || type === 'qa') {
      url += `&articleType=${type}`;
    }
    // 搜索模式不指定文章类型，同时搜索案例和QA
    
    // 添加关键词搜索
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    // 使用小程序专用接口，返回HTML内容
    app.wechatRequest(url)
      .then(res => {
        // 处理返回的数据结构
        const caseStudyData = Array.isArray(res) ? res : [];
        // 格式化数据
        const formattedCaseStudies = caseStudyData.map(item => {
          // 格式化日期
          let formattedDate = '';
          if (item.publish_date) {
            const date = new Date(item.publish_date);
            formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          }
          
          return {
            ...item,
            image_url: item.image_url || '',
            publish_date: formattedDate
          };
        });
        
        // 合并数据
        const newCaseStudies = page === 1 ? formattedCaseStudies : [...caseStudies, ...formattedCaseStudies];
        
        this.setData({
          caseStudies: newCaseStudies,
          page: page + 1,
          loading: false,
          hasMore: formattedCaseStudies.length === pageSize
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
    const articleType = e.currentTarget.dataset.type;
    
    if (articleType === 'case') {
      wx.navigateTo({
        url: `/pages/article-detail/index?id=${id}`
      });
    } else if (articleType === 'qa') {
      wx.navigateTo({
        url: `/pages/qa/index?id=${id}&type=qa`
      });
    }
  }
})