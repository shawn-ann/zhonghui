import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { articleApi, uploadApi } from '../../services/api'
import QuillEditor from '../../components/QuillEditor'

export default function ArticleForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    article_type: 'case',
    image_url: '',
    content: '',
    publish_date: '',
  })
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [errors, setErrors] = useState({})

  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      const response = await articleApi.getById(id)
      const item = response.data
      setFormData({
        title: item.title || '',
        article_type: item.article_type || 'case',
        image_url: item.image_url || '',
        content: item.content || '',
        publish_date: item.publish_date || '',
      })
      if (item.image_url) {
        setImagePreview(item.image_url)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (isEdit) {
      fetchData()
    }
  }, [isEdit, fetchData])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContentChange = (content) => {
    setFormData({ ...formData, content })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
    }
    if (!isEdit && !imageFile && !formData.image_url) {
      newErrors.image = '图片不能为空'
    }
    if (!formData.content.trim()) {
      newErrors.content = '内容不能为空'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        const uploadResponse = await uploadApi.upload(imageFile)
        imageUrl = uploadResponse.data.url
      }

      const data = {
        title: formData.title,
        article_type: formData.article_type,
        image_url: imageUrl,
        content: formData.content,
        publish_date: formData.publish_date || null,
      }

      if (isEdit) {
        await articleApi.update(id, data)
      } else {
        await articleApi.create(data)
      }

      navigate('/article')
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEdit ? '编辑文章' : '添加文章'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">
            上传图片 <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="预览"
              className="mt-2 w-48 h-28 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            文章类型 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.article_type}
            onChange={(e) => setFormData({ ...formData, article_type: e.target.value })}
            disabled={loading}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          >
            <option value="case">案例分享</option>
            <option value="qa">问答文章</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            内容 <span className="text-red-500">*</span>
          </label>
          <QuillEditor
            value={formData.content}
            onChange={handleContentChange}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/article')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
