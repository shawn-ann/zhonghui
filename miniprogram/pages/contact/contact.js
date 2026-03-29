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
      { label: "互惠美国", value: "互惠美国", checked: false },
      { label: "互惠澳洲", value: "互惠澳洲", checked: false },
      { label: "澳洲WHV工作", value: "澳洲WHV工作", checked: false },
      { label: "美国Camp", value: "美国Camp", checked: false },
      { label: "其他", value: "其他", checked: false }
    ],
    selectedIntendedPrograms: [],
    educationLevels: [
      { label: "研究生或以上", value: "研究生或以上" },
      { label: "本科", value: "本科" },
      { label: "大专", value: "大专" },
      { label: "高中毕业", value: "高中毕业" },
      { label: "其他", value: "其他" }
    ],
    conditions: [
      { label: "无犯罪记录", value: "无犯罪记录", checked: false },
      { label: "未婚未育", value: "未婚未育", checked: false },
      { label: "近五年内无心理疾病/手术史", value: "近五年内无心理疾病/手术史", checked: false },
      { label: "有中国C1C2驾照", value: "有中国C1C2驾照", checked: false }
    ],
    educationLevels: [
      { label: "研究生或以上", value: "研究生或以上", checked: false },
      { label: "本科", value: "本科", checked: false },
      { label: "大专", value: "大专", checked: false },
      { label: "高中毕业", value: "高中毕业", checked: false },
      { label: "其他", value: "其他", checked: false }
    ],
    englishLevels: [
      { label: "无语言成绩", value: "无语言成绩", checked: false },
      { label: "有语言成绩", value: "有语言成绩", checked: false }
    ],
    childcareOptions: [
      { label: "否", value: "否", checked: false },
      { label: "是", value: "是", checked: false }
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
    console.log('onProjectChange event:', e);
    const selectedValues = e.detail.value || [];
    console.log('Selected values:', selectedValues);
    
    this.setData({
      'formData.projects': selectedValues
    });
  },

  // 最高学历选择
  onEducationChange(e) {
    const selectedValue = e.detail.value;
    
    this.setData({
      'formData.education': selectedValue
    });
  },

  // 符合条件选择
  onConditionChange(e) {
    console.log('onConditionChange event:', e);
    const selectedValues = e.detail.value || [];
    console.log('Selected values:', selectedValues);
    
    this.setData({
      'formData.conditions': selectedValues
    });
  },

  // 英语成绩选择
  onEnglishLevelChange(e) {
    const selectedValue = e.detail.value;
    
    this.setData({
      'formData.englishLevel': selectedValue,
    });
  },

  // 育儿经验选择
  onChildcareChange(e) {
    const selectedValue = e.detail.value;
    
    this.setData({
      'formData.childcareExp': selectedValue
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
    console.log('Form data before validation:', this.data.formData);
    
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

    console.log('Submit data:', submitData);

    // 提交表单
    app.wechatRequest('/contact', 'POST', submitData)
      .then(res => {
        wx.showToast({ title: '提交成功', icon: 'success' });
        console.log('Before reset formData:', this.data.formData);
        
        // 强制重置表单，先设置为null，再设置为初始值
        this.resetForm();
      })
      .catch(err => {
        console.error('Failed to submit form:', err);

        this.resetForm();
        wx.showToast({ title: '提交失败，请重试', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  onReset() {
    this.resetForm();
  },
  resetForm(){
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
      },
      intendedPrograms: this.data.intendedPrograms.map(item => ({ ...item, checked: false })),
      conditions: this.data.conditions.map(item => ({ ...item, checked: false })),
      educationLevels: this.data.educationLevels.map(item => ({ ...item, checked: false })),
      englishLevels: this.data.englishLevels.map(item => ({ ...item, checked: false })),
      childcareOptions: this.data.childcareOptions.map(item => ({ ...item, checked: false }))
    }, () => {
      // 重置完成后的回调，确保页面更新
      console.log('After reset formData:', this.data.formData);
      console.log('Form reset completed');
    });
  }
})