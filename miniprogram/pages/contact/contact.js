// contact.js
const app = getApp();

Page({
  data: {
    formData: {
      name: '',
      birthday: '',
      projects: [],
      otherProject: '',
      education: '',
      conditions: [],
      englishLevel: '',
      englishScore: '',
      childcareExp: '',
      city: '',
      contact: ''
    },
    loading: false,
    currentDate: new Date().toISOString().split('T')[0],
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
    ],
    conditions: [
      { label: "无犯罪记录", value: "无犯罪记录" },
      { label: "未婚未育", value: "未婚未育" },
      { label: "近五年内无心理疾病/手术史", value: "近五年内无心理疾病/手术史" },
      { label: "有中国C1C2驾照", value: "有中国C1C2驾照" }
    ],
    englishLevels: [
      { label: "无语言成绩", value: "无语言成绩" },
      { label: "有语言成绩", value: "有语言成绩" }
    ],
    childcareOptions: [
      { label: "否", value: "否" },
      { label: "是", value: "是" }
    ]
  },

  // 输入事件
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 生日选择
  onBirthdayChange(e) {
    this.setData({
      'formData.birthday': e.detail.value
    });
  },

  // 意向项目选择
  onProjectChange(e) {
    const { value } = e.detail;
    this.setData({
      'formData.projects': value
    });
  },

  // 最高学历选择
  onEducationChange(e) {
    this.setData({
      'formData.education': e.detail.value
    });
  },

  // 符合条件选择
  onConditionChange(e) {
    const { value } = e.detail;
    this.setData({
      'formData.conditions': value
    });
  },

  // 英语成绩选择
  onEnglishLevelChange(e) {
    this.setData({
      'formData.englishLevel': e.detail.value,
      'formData.englishScore': ''
    });
  },

  // 育儿经验选择
  onChildcareChange(e) {
    this.setData({
      'formData.childcareExp': e.detail.value
    });
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data;

    // 姓名
    if (!formData.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return false;
    }

    // 生日
    if (!formData.birthday) {
      wx.showToast({ title: '请选择生日', icon: 'none' });
      return false;
    }

    // 意向项目
    if (!formData.projects || formData.projects.length === 0) {
      wx.showToast({ title: '请选择意向项目', icon: 'none' });
      return false;
    }

    // 其他项目
    if (formData.projects.includes('其他') && !formData.otherProject) {
      wx.showToast({ title: '请输入其他项目', icon: 'none' });
      return false;
    }

    // 最高学历
    if (!formData.education) {
      wx.showToast({ title: '请选择最高学历', icon: 'none' });
      return false;
    }

    // 符合条件
    if (!formData.conditions || formData.conditions.length === 0) {
      wx.showToast({ title: '请至少选择一项符合条件', icon: 'none' });
      return false;
    }

    // 英语成绩
    if (!formData.englishLevel) {
      wx.showToast({ title: '请选择英语成绩', icon: 'none' });
      return false;
    }

    // 语言成绩
    if (formData.englishLevel === '有语言成绩' && !formData.englishScore) {
      wx.showToast({ title: '请输入语言成绩', icon: 'none' });
      return false;
    }

    // 育儿经验
    if (!formData.childcareExp) {
      wx.showToast({ title: '请选择育儿经验', icon: 'none' });
      return false;
    }

    // 所在城市
    if (!formData.city) {
      wx.showToast({ title: '请输入所在城市', icon: 'none' });
      return false;
    }

    // 联系方式
    if (!formData.contact) {
      wx.showToast({ title: '请输入联系方式', icon: 'none' });
      return false;
    }

    return true;
  },

  // 提交表单
  submitForm(e) {
    if (!this.validateForm()) return;

    this.setData({ loading: true });

    const { formData } = this.data;

    // 准备提交数据
    const submitData = {
      name: formData.name,
      birthday: formData.birthday,
      projects: formData.projects.join(','),
      otherProject: formData.otherProject,
      education: formData.education,
      conditions: formData.conditions.join(','),
      englishLevel: formData.englishLevel,
      englishScore: formData.englishScore,
      childcareExp: formData.childcareExp,
      city: formData.city,
      contact: formData.contact
    };

    // 提交表单
    app.wechatRequest('/contact', 'POST', submitData)
      .then(res => {
        wx.showToast({ title: '提交成功', icon: 'success' });
        // 重置表单
        this.setData({
          formData: {
            name: '',
            birthday: '',
            projects: [],
            otherProject: '',
            education: '',
            conditions: [],
            englishLevel: '',
            englishScore: '',
            childcareExp: '',
            city: '',
            contact: ''
          }
        });
      })
      .catch(err => {
        console.error('Failed to submit form:', err);
        wx.showToast({ title: '提交失败，请重试', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  }
})