// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
  },
  globalData: {
    apiBaseUrl: 'https://www.chinaaupairs.com/miniprogram/api',
    wechatApiBaseUrl: 'https://www.chinaaupairs.com/miniprogram/wechat',
    userInfo: null
  },
  // 封装网络请求
  request(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.apiBaseUrl + url,
        method,
        data,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  // 小程序专用接口请求
  wechatRequest(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.wechatApiBaseUrl + url,
        method,
        data,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
})