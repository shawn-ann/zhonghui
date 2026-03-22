// qa.js
const app = getApp();

Page({
  data: {
    qaArticles: []
  },

  onLoad() {
    this.fetchQAArticles();
  },

  // 获取问答文章
  fetchQAArticles() {
    app.request('/qa-articles')
      .then(res => {
        this.setData({
          qaArticles: res
        });
      })
      .catch(err => {
        console.error('Failed to fetch QA articles:', err);
        // 使用默认数据
        this.setData({
          qaArticles: [
            {
              id: 1,
              title: "Q&A | 报名及退费相关",
              image_url: "https://via.placeholder.com/120x120?text=QA+1",
              publish_date: "2024-12-11",
              view_count: 1335
            },
            {
              id: 2,
              title: "Q&A | 互惠生薪资",
              image_url: "https://via.placeholder.com/120x120?text=QA+2",
              publish_date: "2024-12-11",
              view_count: 795
            },
            {
              id: 3,
              title: "Q&A | 重匹相关",
              image_url: "https://via.placeholder.com/120x120?text=QA+3",
              publish_date: "2024-12-11",
              view_count: 721
            },
            {
              id: 4,
              title: "Q&A | 育儿经验",
              image_url: "https://via.placeholder.com/120x120?text=QA+4",
              publish_date: "2024-12-11",
              view_count: 894
            },
            {
              id: 5,
              title: "Q&A | 入库匹配相关",
              image_url: "https://via.placeholder.com/120x120?text=QA+5",
              publish_date: "2024-12-11",
              view_count: 322
            },
            {
              id: 6,
              title: "Q&A | 美互惠安全吗？",
              image_url: "https://via.placeholder.com/120x120?text=QA+6",
              publish_date: "2024-12-11",
              view_count: 456
            }
          ]
        });
      });
  },

  // 导航到文章详情
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/qa/detail/detail?id=${id}&type=qa`
    });
  }
})