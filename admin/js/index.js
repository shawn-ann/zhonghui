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

  // 初始化 Quill 编辑器
  initializeQuillEditor();

  // 加载轮播图片数据
  loadCarouselImages();
}

// 初始化 Quill 编辑器
function initializeQuillEditor() {
  const editorContainer = document.getElementById('editor');
  if (!editorContainer) return;

  editorInstance = new Quill('#editor', {
    theme: 'snow',
    placeholder: '请输入内容...',
    modules: {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          'image': function() {
            selectLocalImage();
          }
        }
      }
    }
  });

  // 监听内容变化，同步到隐藏字段
  editorInstance.on('text-change', function() {
    const content = document.getElementById('content');
    if (content) {
      content.value = JSON.stringify(editorInstance.getContents());
    }
  });
}

// 选择本地图片并上传
function selectLocalImage() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async function() {
    const file = input.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        insertImageToEditor(imageUrl);
      } catch (error) {
        console.error('图片上传失败:', error);
        alert('图片上传失败，请重试');
      }
    }
  };
}

// 上传图片到服务器
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiBaseUrl}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('上传失败');
  }

  const result = await response.json();
  return result.url;
}

// 插入图片到编辑器
function insertImageToEditor(imageUrl) {
  const range = editorInstance.getSelection();
  const index = range ? range.index : editorInstance.getLength();
  editorInstance.insertEmbed(index, 'image', `http://localhost:3000${imageUrl}`);
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
  
  // 移除点击模态框外部关闭的功能，防止编辑内容丢失
  
  // 模态框表单提交
  document.getElementById('modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // 清除之前的错误信息
    document.getElementById('image-error').textContent = '';
    document.getElementById('title-error').textContent = '';
    document.getElementById('content-error').textContent = '';
    
    // 验证表单
    let isValid = true;
    
    // 验证标题
    const title = formData.get('title');
    if (!title || title.trim() === '') {
      document.getElementById('title-error').textContent = '标题不能为空';
      isValid = false;
    }
    
    // 验证内容
    const content = formData.get('content');
    if (!content || content.trim() === '') {
      document.getElementById('content-error').textContent = '内容不能为空';
      isValid = false;
    }
    
    // 验证图片（新建时必填，编辑时可选）
    const fileInput = document.getElementById('image-upload');
    if (!window.currentItemId && fileInput.files.length === 0) {
      document.getElementById('image-error').textContent = '图片不能为空';
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    try {
      let data = {};
      
      // 处理文件上传
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
        data.title = title;
        data.order_num = formData.get('orderNum');
        data.content = content;
      } else if (window.currentItemType === 'case-studies' || window.currentItemType === 'qa-articles') {
        // 案例分享和问答文章字段
        data.title = title;
        data.content = content;
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
            loadCarouselImages(carouselPage);
            break;
          case 'case-studies':
            loadCaseStudies(caseStudiesPage, caseStudiesKeyword);
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

  // 案例分享搜索
  const searchBtn = document.getElementById('case-study-search-btn');
  const resetBtn = document.getElementById('case-study-reset-btn');
  const searchInput = document.getElementById('case-study-search');

  if (searchBtn) {
    searchBtn.addEventListener('click', searchCaseStudies);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetCaseStudiesSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchCaseStudies();
      }
    });
  }

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
  
  // 清空错误信息
  document.getElementById('image-error').textContent = '';
  document.getElementById('title-error').textContent = '';
  document.getElementById('content-error').textContent = '';
  
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
        try {
          // 尝试解析为 Quill Delta 格式
          const delta = JSON.parse(item.content);
          editorInstance.setContents(delta);
        } catch (e) {
          // 如果不是 JSON 格式，则作为 HTML 文本设置
          editorInstance.setText(item.content);
        }
      }
      document.getElementById('content').value = item.content;
    } else {
      if (editorInstance) {
        editorInstance.setContents([]);
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
      editorInstance.setContents([]);
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

// 轮播图分页状态
let carouselPage = 1;
const carouselPageSize = 10;

// 加载轮播图片
async function loadCarouselImages(page = 1) {
  try {
    const response = await fetch(`${apiBaseUrl}/carousel?page=${page}&pageSize=${carouselPageSize}`);
    const result = await response.json();
    const images = result.data || [];
    const totalCount = result.total || 0;
    
    const carouselBody = document.getElementById('carousel-body');
    carouselBody.innerHTML = '';
    
    if (images.length === 0) {
      carouselBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
    } else {
      images.forEach(image => {
        // 创建编辑按钮
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '编辑';
        editButton.onclick = () => openModal('编辑轮播图片', 'carousel', image);
        
        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '删除';
        deleteButton.onclick = () => deleteItem(image.id, 'carousel');
        
        // 创建操作按钮容器
        const actionContainer = document.createElement('td');
        actionContainer.className = 'action-buttons';
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);
        
        // 创建行
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${image.id}</td>
          <td>${image.title}</td>
          <td>${image.order_num || 0}</td>
          <td><img src="http://localhost:3000${image.image_url}" alt="${image.title}" style="max-width: 100px; max-height: 60px; object-fit: cover; border-radius: 4px;"></td>
        `;
        row.appendChild(actionContainer);
        carouselBody.appendChild(row);
      });
    }
    
    // 生成分页
    const totalPages = Math.ceil(totalCount / carouselPageSize);
    generateCarouselPagination('carousel-pagination', page, totalPages);
    carouselPage = page;
  } catch (error) {
    console.error('Error loading carousel images:', error);
  }
}

// 生成轮播图分页
function generateCarouselPagination(containerId, currentPage, totalPages) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  // 上一页按钮
  const prevButton = document.createElement('button');
  prevButton.textContent = '上一页';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      loadCarouselImages(currentPage - 1);
    }
  };
  container.appendChild(prevButton);
  
  // 页码按钮
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? 'active' : '';
    pageButton.onclick = () => {
      loadCarouselImages(i);
    };
    container.appendChild(pageButton);
  }
  
  // 下一页按钮
  const nextButton = document.createElement('button');
  nextButton.textContent = '下一页';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      loadCarouselImages(currentPage + 1);
    }
  };
  container.appendChild(nextButton);
}

// 案例分享分页状态
let caseStudiesPage = 1;
const caseStudiesPageSize = 10;
let caseStudiesKeyword = '';

// 加载案例分享
async function loadCaseStudies(page = 1, keyword = '') {
  try {
    // 保存当前搜索关键字
    if (keyword !== undefined) {
      caseStudiesKeyword = keyword;
    }
    
    let url = `${apiBaseUrl}/case-studies?page=${page}&pageSize=${caseStudiesPageSize}`;
    if (caseStudiesKeyword) {
      url += `&keyword=${encodeURIComponent(caseStudiesKeyword)}`;
    }
    
    const response = await fetch(url);
    const result = await response.json();
    const caseStudies = result.data || [];
    const totalCount = result.total || 0;
    
    const caseStudiesBody = document.getElementById('case-studies-body');
    caseStudiesBody.innerHTML = '';
    
    if (caseStudies.length === 0) {
      caseStudiesBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
    } else {
      caseStudies.forEach(caseStudy => {
        // 格式化日期
        const formattedDate = caseStudy.publish_date ? new Date(caseStudy.publish_date).toLocaleString('zh-CN') : '';
        // 创建编辑按钮
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '编辑';
        editButton.onclick = () => openModal('编辑案例分享', 'case-studies', caseStudy);
        
        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '删除';
        deleteButton.onclick = () => deleteItem(caseStudy.id, 'case-studies');
        
        // 创建操作按钮容器
        const actionContainer = document.createElement('td');
        actionContainer.className = 'action-buttons';
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);
        
        // 创建行
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${caseStudy.id}</td>
          <td>${caseStudy.title}</td>
          <td>${formattedDate}</td>
          <td>${caseStudy.view_count || 0}</td>
        `;
        row.appendChild(actionContainer);
        caseStudiesBody.appendChild(row);
      });
    }
    
    // 生成分页
    const totalPages = Math.ceil(totalCount / caseStudiesPageSize);
    generatePagination('case-studies-pagination', page, totalPages);
    caseStudiesPage = page;
  } catch (error) {
    console.error('Error loading case studies:', error);
  }
}

// 搜索案例分享
function searchCaseStudies() {
  const keyword = document.getElementById('case-study-search').value.trim();
  loadCaseStudies(1, keyword);
}

// 重置案例分享搜索
function resetCaseStudiesSearch() {
  document.getElementById('case-study-search').value = '';
  loadCaseStudies(1, '');
}

// 生成分页
function generatePagination(containerId, currentPage, totalPages) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  // 上一页按钮
  const prevButton = document.createElement('button');
  prevButton.textContent = '上一页';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      if (containerId === 'case-studies-pagination') {
        loadCaseStudies(currentPage - 1);
      }
    }
  };
  container.appendChild(prevButton);
  
  // 页码按钮
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? 'active' : '';
    pageButton.onclick = () => {
      if (containerId === 'case-studies-pagination') {
        loadCaseStudies(i);
      }
    };
    container.appendChild(pageButton);
  }
  
  // 下一页按钮
  const nextButton = document.createElement('button');
  nextButton.textContent = '下一页';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      if (containerId === 'case-studies-pagination') {
        loadCaseStudies(currentPage + 1);
      }
    }
  };
  container.appendChild(nextButton);
}

// 删除项目
async function deleteItem(id, type) {
  if (confirm('确定要删除吗？')) {
    try {
      const response = await fetch(`${apiBaseUrl}/${type}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // 重新加载数据
        if (type === 'case-studies') {
          loadCaseStudies(caseStudiesPage);
        } else if (type === 'qa-articles') {
          loadQAArticles();
        } else if (type === 'carousel') {
          loadCarouselImages(carouselPage);
        }
      } else {
        alert('删除失败，请重试');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('删除失败，请重试');
    }
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
