import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 轮播图 API
export const carouselApi = {
  getList: (params) => api.get('/carousel', { params }),
  getById: (id) => api.get(`/carousel/${id}`),
  create: (data) => api.post('/carousel', data),
  update: (id, data) => api.put(`/carousel/${id}`, data),
  delete: (id) => api.delete(`/carousel/${id}`),
}

// 文章 API
export const articleApi = {
  getList: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
}

// 联系表单 API
export const contactApi = {
  getList: (params) => api.get('/contact', { params }),
}

// 管理员 API
export const adminApi = {
  login: (data) => api.post('/admin/login', data),
  changePassword: (data) => api.put('/admin/password', data),
}

// 文件上传
export const uploadApi = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
