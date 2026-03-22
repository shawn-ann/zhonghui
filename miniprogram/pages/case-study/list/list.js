// list.js
const app = getApp();

Page({
  data: {
    caseStudies: [],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.fetchCaseStudies();
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.fetchCaseStudies();
    }
  },

  // 获取案例分享列表（带分页）
  fetchCaseStudies() {
    const { page, pageSize, caseStudies } = this.data;

    this.setData({ loading: true });

    // 使用小程序专用接口，返回HTML内容
    app.wechatRequest(`/case-studies?page=${page}&pageSize=${pageSize}`)
      .then(res => {
        // 格式化数据
        const formattedCaseStudies = res.map(item => {
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
        const newCaseStudies = page === 1 ? formattedCaseStudies : [...caseStudies, ...formattedCaseStudies];
        
        this.setData({
          caseStudies: newCaseStudies,
          page: page + 1,
          loading: false,
          hasMore: formattedCaseStudies.length === pageSize
        });
      })
      .catch(err => {
        console.error('Failed to fetch case studies:', err);
        this.setData({ loading: false });
      });
  },

  // 导航到案例详情
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/qa/detail/detail?id=${id}&type=case`
    });
  }
})