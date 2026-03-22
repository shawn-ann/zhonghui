// index.js
const apiBaseUrl = 'http://localhost:3000/api';
let editorInstance = null;

// 页面加载时检查登录状态
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
  }
  
  initializeAdmin();
});

function initializeAdmin() {
  // 初始化导航
  setupNavigation();
  
  // 初始化模态框
  setupModal();
  
  // 初始化事件监听器
  setupEventListeners();
  
  // 加载轮播图片数据
  loadCarouselImages();
}

// 设置导航
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 移除所有活动状态
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // 添加活动状态到当前链接和对应部分
      link.classList.add('active');
      const sectionId = link.dataset.section + '-section';
      document.getElementById(sectionId).classList.add('active');
      
      // 加载对应的数据
      switch (link.dataset.section) {
        case 'carousel':
          loadCarouselImages();
          break;
        case 'case-studies':
          loadCaseStudies();
          break;
        case 'qa-articles':
          loadQAArticles();
          break;
        case 'contact-submissions':
          loadContactSubmissions();
          break;
      }
    });
  });
}

// 设置模态框
function setupModal() {
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('close-modal');
  const cancelButton = document.getElementById('cancel-button');
  
  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
  });
  
  cancelButton.addEventListener('click', () => {
    modal.classList.remove('show');
  });
  
  // 点击模态框外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
  
  // 模态框表单提交
  document.getElementById('modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    try {
      let data = {};
      
      // 处理文件上传
      const fileInput = document.getElementById('image-upload');
      if (fileInput.files.length > 0) {
        // 上传文件
        const uploadFormData = new FormData();
        uploadFormData.append('file', fileInput.files[0]);
        
        const uploadResponse = await fetch(`${apiBaseUrl}/upload`, {
          method: 'POST',
          body: uploadFormData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('文件上传失败');
        }
        
        const uploadResult = await uploadResponse.json();
        data.image_url = uploadResult.url;
      } else if (window.currentItemId && window.currentItem) {
        // 编辑模式且没有上传新文件，保持原有图片
        // 使用存储的 currentItem 对象中的 image_url
        data.image_url = window.currentItem.image_url;
      }
      
      // 根据类型处理不同的字段
      if (window.currentItemType === 'carousel') {
        // 轮播图字段
        data.title = formData.get('title');
        data.order_num = formData.get('orderNum');
        data.content = formData.get('content');
      } else if (window.currentItemType === 'case-studies' || window.currentItemType === 'qa-articles') {
        // 案例分享和问答文章字段
        data.title = formData.get('title');
        data.content = formData.get('content');
      }
      
      let response;
      if (window.currentItemId) {
        // 更新现有项目
        response = await fetch(`${apiBaseUrl}/${window.currentItemType}/${window.currentItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } else {
        // 创建新项目
        response = await fetch(`${apiBaseUrl}/${window.currentItemType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
      
      if (response.ok) {
        modal.classList.remove('show');
        // 重新加载数据
        switch (window.currentItemType) {
          case 'carousel':
            loadCarouselImages();
            break;
          case 'case-studies':
            loadCaseStudies();
            break;
          case 'qa-articles':
            loadQAArticles();
            break;
        }
      } else {
        alert('操作失败，请重试');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('操作失败，请重试');
    }
  });
}

// 设置事件监听器
function setupEventListeners() {
  // 退出登录
  document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  });
  
  // 添加轮播图片
  document.getElementById('add-carousel').addEventListener('click', () => {
    openModal('添加轮播图片', 'carousel');
  });
  
  // 添加案例分享
  document.getElementById('add-case-study').addEventListener('click', () => {
    openModal('添加案例分享', 'case-studies');
  });
  
  // 添加问答文章
  document.getElementById('add-qa-article').addEventListener('click', () => {
    openModal('添加问答文章', 'qa-articles');
  });
}

// 打开模态框
function openModal(title, type, item = null) {
  document.getElementById('modal-title').textContent = title;
  window.currentItemType = type;
  window.currentItemId = item ? item.id : null;
  window.currentItem = item; // 存储当前编辑的项目
  
  // 重置表单
  const form = document.getElementById('modal-form');
  form.reset();
  
  // 根据类型显示或隐藏不同的字段
  const orderNumGroup = document.getElementById('order-num-group');
  
  if (type === 'carousel') {
    // 轮播图显示排序字段
    orderNumGroup.style.display = 'block';
  } else if (type === 'case-studies' || type === 'qa-articles') {
    // 案例分享和问答文章隐藏排序字段
    orderNumGroup.style.display = 'none';
  }
  
  // 填充表单数据（如果是编辑）
  if (item) {
    document.getElementById('title').value = item.title || '';
    
    // 只有轮播图需要排序字段
    if (type === 'carousel') {
      document.getElementById('order-num').value = item.order_num || 0;
    }
    
    // 设置富文本编辑器内容
    if (item.content) {
      if (editorInstance) {
        editorInstance.setData(item.content);
      }
      document.getElementById('content').value = item.content;
    } else {
      if (editorInstance) {
        editorInstance.setData('');
      }
      document.getElementById('content').value = '';
    }
    

    
    // 显示图片预览
    const imagePreview = document.getElementById('image-preview');
    if (item.image_url) {
      imagePreview.innerHTML = `<img src="http://localhost:3000${item.image_url}" alt="${item.title}">`;
    } else {
      imagePreview.innerHTML = '';
    }
  } else {
    // 清空表单数据
    document.getElementById('title').value = '';
    document.getElementById('order-num').value = '0';
    if (editorInstance) {
      editorInstance.setData('');
    }
    document.getElementById('content').value = '';
    
    // 清空图片预览
    document.getElementById('image-preview').innerHTML = '';
  }
  
  // 为图片上传输入框添加事件监听器，实时更新预览图
  const fileInput = document.getElementById('image-upload');
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="预览图片">`;
      };
      reader.readAsDataURL(file);
    } else {
      // 清空预览图
      document.getElementById('image-preview').innerHTML = '';
    }
  });
  
  // 显示模态框
  document.getElementById('modal').classList.add('show');
}

// 加载轮播图片
async function loadCarouselImages() {
  try {
    const response = await fetch(`${apiBaseUrl}/carousel`);
    const images = await response.json();
    
    const carouselList = document.getElementById('carousel-list');
    carouselList.innerHTML = '';
    
    images.forEach(image => {
      const card = createItemCard(image, 'carousel');
      carouselList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading carousel images:', error);
  }
}

// 加载案例分享
async function loadCaseStudies() {
  try {
    const response = await fetch(`${apiBaseUrl}/case-studies`);
    const caseStudies = await response.json();
    
    const caseStudiesList = document.getElementById('case-studies-list');
    caseStudiesList.innerHTML = '';
    
    caseStudies.forEach(caseStudy => {
      const card = createItemCard(caseStudy, 'case-studies');
      caseStudiesList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading case studies:', error);
  }
}

// 加载问答文章
async function loadQAArticles() {
  try {
    const response = await fetch(`${apiBaseUrl}/qa-articles`);
    const articles = await response.json();
    
    const qaArticlesList = document.getElementById('qa-articles-list');
    qaArticlesList.innerHTML = '';
    
    articles.forEach(article => {
      const card = createItemCard(article, 'qa-articles');
      qaArticlesList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading QA articles:', error);
  }
}

// 加载联系表单提交
async function loadContactSubmissions() {
  try {
    const response = await fetch(`${apiBaseUrl}/contact`);
    const submissions = await response.json();
    
    const contactSubmissionsList = document.getElementById('contact-submissions-list');
    contactSubmissionsList.innerHTML = '';
    
    submissions.forEach(submission => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-info">
          <div class="item-title">${submission.name}</div>
          <div class="item-meta">
            <div>生日: ${submission.birthday}</div>
            <div>意向项目: ${submission.intended_programs}</div>
            <div>最高学历: ${submission.highest_education}</div>
            <div>提交时间: ${submission.created_at}</div>
          </div>
        </div>
      `;
      contactSubmissionsList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading contact submissions:', error);
  }
}

// 创建项目卡片
function createItemCard(item, type) {
  const card = document.createElement('div');
  card.className = 'item-card';
  
  let metaHTML = '';
  if (type === 'carousel') {
    metaHTML = `
      <div class="item-meta">
        <div>排序: ${item.order_num}</div>
        <div>发布日期: ${item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</div>
      </div>
    `;
  } else {
    metaHTML = `
      <div class="item-meta">
        <div>发布日期: ${item.publish_date ? new Date(item.publish_date).toLocaleDateString() : ''}</div>
        <div>浏览次数: ${item.view_count}</div>
      </div>
    `;
  }
  
  let imageHTML = '';
  if (type === 'carousel' && item.image_url) {
    imageHTML = `<div class="item-image"><img src="http://localhost:3000${item.image_url}" alt="${item.title}"></div>`;
  }
  
  card.innerHTML = `
    <div class="item-content">
      ${imageHTML}
      <div class="item-info">
        <div class="item-title">${item.title}</div>
        ${metaHTML}
      </div>
    </div>
    <div class="item-actions">
      <button class="edit-button" data-id="${item.id}" data-type="${type}">编辑</button>
      <button class="delete-button" data-id="${item.id}" data-type="${type}">删除</button>
    </div>
  `;
  
  // 添加编辑按钮事件
  card.querySelector('.edit-button').addEventListener('click', () => {
    openModal(`编辑${getTypeName(type)}`, type, item);
  });
  
  // 添加删除按钮事件
  card.querySelector('.delete-button').addEventListener('click', async () => {
    if (confirm('确定要删除这个项目吗？')) {
      try {
        const response = await fetch(`${apiBaseUrl}/${type}/${item.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // 重新加载数据
          switch (type) {
            case 'carousel':
              loadCarouselImages();
              break;
            case 'case-studies':
              loadCaseStudies();
              break;
            case 'qa-articles':
              loadQAArticles();
              break;
          }
        } else {
          alert('删除失败，请重试');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('删除失败，请重试');
      }
    }
  });
  
  return card;
}

// 获取类型名称
function getTypeName(type) {
  switch (type) {
    case 'carousel':
      return '轮播图片';
    case 'case-studies':
      return '案例分享';
    case 'qa-articles':
      return '问答文章';
    default:
      return '';
  }
}
