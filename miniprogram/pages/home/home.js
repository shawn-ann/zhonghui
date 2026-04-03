// home.js
const app = getApp();

Page({
  data: {
    carouselImages: [],
    current: 0,
    submenus: [],
    caseStudies: [],
    searchKeyword: ''
  },

  onLoad() {
    this.fetchCarouselImages();
    this.fetchCaseStudies();
    this.fetchMenus();
  },

  // 获取首页菜单
  fetchMenus() {
    app.request('/home-menus')
      .then(res => {
        const menus = (res || []).map(item => ({
          ...item,
          icon: item.icon_url || '/images/icon/car1.png'
        }));
        this.setData({
          submenus: menus
        });
      })
      .catch(err => {
        console.error('Failed to fetch menus:', err);
      });
  },

  // 轮播图切换事件
  onSwiperChange(e) {
    this.setData({
      current: e.detail.current
    });
  },

  // 菜单点击事件
  onMenuTap(e) {
    const { id, content } = e.currentTarget.dataset;
    if (content) {
      wx.navigateTo({
        url: `/pages/menu-detail/index?id=${id}`
      });
    }
  },

  // 获取轮播图片
  fetchCarouselImages() {
    app.request('/carousel')
      .then(res => {
        // 处理返回的数据结构
        const carouselData = res.data || [];
        this.setData({
          carouselImages: carouselData
        });
      })
      .catch(err => {
        console.error('Failed to fetch carousel images:', err);
        // 使用默认图片
        this.setData({
          carouselImages: [
            { id: 1, image_url: "https://via.placeholder.com/300x200?text=Carousel+1" },
            { id: 2, image_url: "https://via.placeholder.com/300x200?text=Carousel+2" }
          ]
        });
      });
  },

  // 获取案例分享
  fetchCaseStudies() {
    // 添加分页参数和文章类型参数，默认获取前10条案例分享
    app.wechatRequest('/articles?page=1&pageSize=10&articleType=case')
      .then(res => {
        // 处理返回的数据结构
        const caseStudyData = Array.isArray(res) ? res : [];
        // 将相对路径转换为完整的 URL，并格式化日期
        const caseStudies = caseStudyData.map(item => {
          // 格式化日期为年月日格式
          let formattedDate = '';
          if (item.publish_date) {
            const date = new Date(item.publish_date);
            // 使用本地时间方法获取时间，确保显示正确的服务器时间
            formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
          }
          
          return {
            ...item,
            image_url: item.image_url || '',
            publish_date: formattedDate
          };
        });
        this.setData({
          caseStudies: caseStudies
        });
      })
      .catch(err => {
        console.error('Failed to fetch case studies:', err);
      });
  },

  // 导航到案例分享详情
  navigateToCaseStudy(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/article-detail/index?id=${id}`
    });
  },

  // 轮播图点击事件
  onCarouselTap(e) {
    const { article_url: articleUrl } = e.currentTarget.dataset;
    if (articleUrl) {
      wx.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(articleUrl)}`
      });
    }
  },

  // 导航到案例分享列表
  navigateToCaseStudyList() {
    console.log('navigateToCaseStudyList called');
    wx.navigateTo({
      url: '/pages/case-study/index',
      success: function(res) {
        console.log('Navigation success:', res);
      },
      fail: function(err) {
        console.log('Navigation failed:', err);
      }
    });
  },

  // 搜索输入事件
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索按钮点击事件
  onSearch() {
    const { searchKeyword } = this.data;
    if (!searchKeyword.trim()) {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
      return;
    }
    
    // 导航到搜索结果页面并传递搜索关键词
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(searchKeyword)}`
    });
  }
})