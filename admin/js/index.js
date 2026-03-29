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
        case 'articles':
          loadArticles();
          break;
        case 'contact':
          loadContacts();
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
      } else if (window.currentItemType === 'articles') {
        // 文章字段
        data.title = title;
        data.content = content;
        // 从表单获取文章类型
        const articleType = formData.get('articleType');
        if (articleType) {
          data.article_type = articleType;
        } else if (window.currentItem) {
          // 编辑模式下使用现有类型
          data.article_type = window.currentItem.article_type;
        }
      }
      
      let response;
      let apiEndpoint;
      
      if (window.currentItemType === 'articles') {
        // 使用统一的 articles 接口
        apiEndpoint = 'articles';
      } else {
        // 其他类型使用原有接口
        apiEndpoint = window.currentItemType;
      }
      
      if (window.currentItemId) {
        // 更新现有项目
        response = await fetch(`${apiBaseUrl}/${apiEndpoint}/${window.currentItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } else {
        // 创建新项目
        response = await fetch(`${apiBaseUrl}/${apiEndpoint}`, {
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
          case 'articles':
            loadArticles(articlesPage, articlesKeyword, articlesType);
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

  // 添加文章
  const addArticleBtn = document.getElementById('add-article');
  if (addArticleBtn) {
    addArticleBtn.addEventListener('click', () => {
      openModal('添加文章', 'articles');
    });
  }

  // 文章搜索
  const articleSearchBtn = document.getElementById('article-search-btn');
  const articleResetBtn = document.getElementById('article-reset-btn');
  const articleSearchInput = document.getElementById('article-search');
  const articleTypeFilter = document.getElementById('article-type-filter');

  if (articleSearchBtn) {
    articleSearchBtn.addEventListener('click', searchArticles);
  }

  if (articleResetBtn) {
    articleResetBtn.addEventListener('click', resetArticlesSearch);
  }

  if (articleSearchInput) {
    articleSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchArticles();
      }
    });
  }

  if (articleTypeFilter) {
    articleTypeFilter.addEventListener('change', searchArticles);
  }
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
  const articleTypeGroup = document.getElementById('article-type-group');
  
  if (type === 'carousel') {
    // 轮播图显示排序字段
    orderNumGroup.style.display = 'block';
    articleTypeGroup.style.display = 'none';
  } else if (type === 'articles') {
    // 文章隐藏排序字段，显示文章类型字段
    orderNumGroup.style.display = 'none';
    articleTypeGroup.style.display = 'block';
  }
  
  // 填充表单数据（如果是编辑）
  if (item) {
    document.getElementById('title').value = item.title || '';
    
    // 只有轮播图需要排序字段
    if (type === 'carousel') {
      document.getElementById('order-num').value = item.order_num || 0;
    } else if (type === 'articles' && item.article_type) {
      // 文章需要设置文章类型
      document.getElementById('article-type').value = item.article_type;
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
    if (type === 'articles') {
      // 新建文章时默认选择案例分享
      document.getElementById('article-type').value = 'case';
    }
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
        actionContainer.style.padding = '12px 15px';
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);
        
        // 创建行
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${image.id}</td>
          <td><img src="http://localhost:3000${image.image_url}" alt="${image.title}" style="max-width: 100px; max-height: 60px; object-fit: cover; border-radius: 4px;"></td>
          <td>${image.title}</td>
          <td>${image.order_num || 0}</td>
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

// 文章管理分页状态
let articlesPage = 1;
const articlesPageSize = 10;
let articlesKeyword = '';
let articlesType = '';

// 加载文章
async function loadArticles(page = 1, keyword = '', articleType = '') {
  try {
    // 保存当前搜索参数
    if (keyword !== undefined) {
      articlesKeyword = keyword;
    }
    if (articleType !== undefined) {
      articlesType = articleType;
    }
    
    let url = `${apiBaseUrl}/articles?page=${page}&pageSize=${articlesPageSize}`;
    if (articlesType) {
      url += `&articleType=${encodeURIComponent(articlesType)}`;
    }
    if (articlesKeyword) {
      url += `&keyword=${encodeURIComponent(articlesKeyword)}`;
    }
    
    const response = await fetch(url);
    const result = await response.json();
    const articles = result.data || [];
    const totalCount = result.total || 0;
    
    const articlesBody = document.getElementById('articles-body');
    articlesBody.innerHTML = '';
    
    if (articles.length === 0) {
      articlesBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
    } else {
      articles.forEach(article => {
        // 格式化日期
        const formattedDate = article.publish_date ? new Date(article.publish_date).toLocaleString('zh-CN') : '';
        // 文章类型显示文本
        const typeText = article.article_type === 'case' ? '案例分享' : '问答文章';
        // 创建编辑按钮
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '编辑';
        editButton.onclick = () => openModal('编辑文章', 'articles', article);
        
        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '删除';
        deleteButton.onclick = () => deleteItem(article.id, 'articles');
        
        // 创建操作按钮容器
        const actionContainer = document.createElement('td');
        actionContainer.className = 'action-buttons';
        actionContainer.style.padding = '12px 15px';
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);
        
        // 创建行
        const row = document.createElement('tr');
        const imageHtml = article.image_url ? `<img src="http://localhost:3000${article.image_url}" alt="${article.title}" style="max-width: 80px; max-height: 50px; object-fit: cover; border-radius: 4px;">` : '';
        row.innerHTML = `
          <td>${article.id}</td>
          <td>${imageHtml}</td>
          <td>${article.title}</td>
          <td>${typeText}</td>
          <td>${formattedDate}</td>
          <td>${article.view_count || 0}</td>
        `;
        row.appendChild(actionContainer);
        articlesBody.appendChild(row);
      });
    }
    
    // 生成分页
    const totalPages = Math.ceil(totalCount / articlesPageSize);
    generatePagination('articles-pagination', page, totalPages);
    articlesPage = page;
  } catch (error) {
    console.error('Error loading articles:', error);
  }
}

// 搜索文章
function searchArticles() {
  const keyword = document.getElementById('article-search').value.trim();
  const articleType = document.getElementById('article-type-filter').value;
  loadArticles(1, keyword, articleType);
}

// 重置文章搜索
function resetArticlesSearch() {
  document.getElementById('article-search').value = '';
  document.getElementById('article-type-filter').value = '';
  loadArticles(1, '', '');
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
        loadCaseStudies(currentPage - 1, caseStudiesKeyword);
      } else if (containerId === 'articles-pagination') {
        loadArticles(currentPage - 1, articlesKeyword, articlesType);
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
        loadCaseStudies(i, caseStudiesKeyword);
      } else if (containerId === 'articles-pagination') {
        loadArticles(i, articlesKeyword, articlesType);
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
        loadCaseStudies(currentPage + 1, caseStudiesKeyword);
      } else if (containerId === 'articles-pagination') {
        loadArticles(currentPage + 1, articlesKeyword, articlesType);
      }
    }
  };
  container.appendChild(nextButton);
}

// 删除项目
async function deleteItem(id, type) {
  if (confirm('确定要删除吗？')) {
    try {
      let apiEndpoint = type;
      if (type === 'case-studies' || type === 'qa-articles' || type === 'articles') {
        apiEndpoint = 'articles';
      }
      
      const response = await fetch(`${apiBaseUrl}/${apiEndpoint}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // 重新加载数据
        if (type === 'case-studies') {
          loadCaseStudies(caseStudiesPage, caseStudiesKeyword);
        } else if (type === 'qa-articles') {
          loadQAArticles();
        } else if (type === 'articles') {
          loadArticles(articlesPage, articlesKeyword, articlesType);
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



// 联系表单分页状态
let contactPage = 1;
const contactPageSize = 10;

// 加载联系表单
async function loadContacts(page = 1) {
  try {
    const response = await fetch(`${apiBaseUrl}/contact?page=${page}&pageSize=${contactPageSize}`);
    const result = await response.json();
    const contacts = result.data.contacts || [];
    const totalCount = result.data.total || 0;
    
    const contactBody = document.getElementById('contact-body');
    contactBody.innerHTML = '';
    
    if (contacts.length === 0) {
      contactBody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
    } else {
      contacts.forEach(contact => {
        // 格式化日期
        const formattedDate = contact.created_at ? new Date(contact.created_at).toLocaleString('zh-CN') : '';
        
        // 创建行
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${contact.id}</td>
          <td>${contact.name}</td>
          <td>${contact.birthday}</td>
          <td>${contact.intended_programs || contact.projects}</td>
          <td>${contact.highest_education || contact.education}</td>
          <td>${contact.conditions}</td>
          <td>${contact.english_level || contact.englishLevel}</td>
          <td>${contact.english_score || contact.englishScore || ''}</td>
          <td>${contact.childcare_exp || contact.childcareExp}</td>
          <td>${contact.city}</td>
          <td>${contact.contact}</td>
          <td>${formattedDate}</td>
        `;
        contactBody.appendChild(row);
      });
    }
    
    // 生成分页
    const totalPages = Math.ceil(totalCount / contactPageSize);
    generateContactPagination('contact-pagination', page, totalPages);
    contactPage = page;
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
}

// 生成联系表单分页
function generateContactPagination(containerId, currentPage, totalPages) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  // 上一页按钮
  const prevButton = document.createElement('button');
  prevButton.textContent = '上一页';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      loadContacts(currentPage - 1);
    }
  };
  container.appendChild(prevButton);
  
  // 页码按钮
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? 'active' : '';
    pageButton.onclick = () => {
      loadContacts(i);
    };
    container.appendChild(pageButton);
  }
  
  // 下一页按钮
  const nextButton = document.createElement('button');
  nextButton.textContent = '下一页';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      loadContacts(currentPage + 1);
    }
  };
  container.appendChild(nextButton);
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
