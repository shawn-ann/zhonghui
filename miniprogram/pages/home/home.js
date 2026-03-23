// home.js
const app = getApp();

Page({
  data: {
    carouselImages: [],
    submenus: [
      {
        title: "互惠美国",
        icon: "/images/icon/car1.png"
      },
      {
        title: "澳洲whv",
        icon: "/images/icon/car2.png"
      },
      {
        title: "美国营地",
        icon: "/images/icon/car3.png"
      },
      {
        title: "我要咨询",
        icon: "/images/icon/car4.png"
      }
    ],
    caseStudies: []
  },

  onLoad() {
    this.fetchCarouselImages();
    this.fetchCaseStudies();
  },

  // 获取轮播图片
  fetchCarouselImages() {
    app.request('/carousel')
      .then(res => {
        // 将相对路径转换为完整的 URL
        const carouselImages = res.map(item => ({
          ...item,
          image_url: app.globalData.apiBaseUrl.replace('/api', '') + item.image_url
        }));
        this.setData({
          carouselImages: carouselImages
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
    // 添加分页参数，默认获取前10条
    app.request('/case-studies?page=1&pageSize=10')
      .then(res => {
        // 将相对路径转换为完整的 URL，并格式化日期
        const caseStudies = res.map(item => {
          // 格式化日期为年月日格式
          let formattedDate = '';
          if (item.publish_date) {
            const date = new Date(item.publish_date);
            // 使用本地时间方法获取时间，确保显示正确的服务器时间
            formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
          }
          
          return {
            ...item,
            image_url: item.image_url ? app.globalData.apiBaseUrl.replace('/api', '') + item.image_url : '',
            publish_date: formattedDate
          };
        });
        this.setData({
          caseStudies: caseStudies
        });
      })
      .catch(err => {
        console.error('Failed to fetch case studies:', err);
        // 使用默认数据
        this.setData({
          caseStudies: [
            {
              id: 1,
              title: "案例分享 | 陕西妹子，电子信息工程专业...",
              image_url: "https://via.placeholder.com/150x150?text=Case+1",
              publish_date: "2026年3月6日",
              view_count: 307
            },
            {
              id: 2,
              title: "案例分享 | 湖北妹子，物流管理专业，...",
              image_url: "https://via.placeholder.com/150x150?text=Case+2",
              publish_date: "2026年2月4日",
              view_count: 199
            },
            {
              id: 3,
              title: "案例分享 | 湖南妹子，食品安全与工程...",
              image_url: "https://via.placeholder.com/150x150?text=Case+3",
              publish_date: "2026年1月15日",
              view_count: 256
            }
          ]
        });
      });
  },

  // 导航到案例分享详情
  navigateToCaseStudy(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/case-study/detail/detail?id=${id}`
    });
  },

  // 导航到案例分享列表
  navigateToCaseStudyList() {
    wx.navigateTo({
      url: '/pages/case-study/list/list'
    });
  }
})