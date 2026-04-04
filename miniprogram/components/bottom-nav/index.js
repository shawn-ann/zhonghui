Component({
  properties: {
    current: {
      type: String,
      value: 'home'
    }
  },

  methods: {
    onTabTap(e) {
      const page = e.currentTarget.dataset.page;
      if (page === this.data.current) return;
      
      let url = '';
      if (page === 'home') {
        url = '/pages/home/home';
      } else if (page === 'qa') {
        url = '/pages/qa/index';
      } else if (page === 'contact') {
        url = '/pages/contact/contact';
      }
      
      if (url) {
        wx.navigateTo({ url });
      }
    }
  }
});