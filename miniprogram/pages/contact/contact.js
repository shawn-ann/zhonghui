// contact.js
const app = getApp();

Page({
  data: {
    intendedPrograms: [
      { label: "互惠美国", value: "互惠美国" },
      { label: "互惠澳洲", value: "互惠澳洲" },
      { label: "澳洲WHV工作", value: "澳洲WHV工作" },
      { label: "美国Camp", value: "美国Camp" },
      { label: "其他", value: "其他" }
    ],
    educationLevels: [
      { label: "研究生或以上", value: "研究生或以上" },
      { label: "本科", value: "本科" },
      { label: "大专", value: "大专" },
      { label: "高中毕业", value: "高中毕业" },
      { label: "其他", value: "其他" }
    ]
  },

  // 提交表单
  submitForm(e) {
    const formData = e.detail.value;
    
    // 表单验证
    if (!formData.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.birthday) {
      wx.showToast({
        title: '请选择生日',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.intendedPrograms || formData.intendedPrograms.length === 0) {
      wx.showToast({
        title: '请选择意向项目',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.highestEducation) {
      wx.showToast({
        title: '请选择最高学历',
        icon: 'none'
      });
      return;
    }
    
    // 准备提交数据
    const submitData = {
      name: formData.name,
      birthday: formData.birthday,
      intendedPrograms: formData.intendedPrograms.join(','),
      highestEducation: formData.highestEducation
    };
    
    // 提交表单
    app.request('/contact', 'POST', submitData)
      .then(res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        });
        // 重置表单
        this.setData({
          formData: {
            name: '',
            birthday: '',
            intendedPrograms: [],
            highestEducation: ''
          }
        });
      })
      .catch(err => {
        console.error('Failed to submit form:', err);
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
      });
  }
})