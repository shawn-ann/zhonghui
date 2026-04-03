import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { homeMenuApi, uploadApi } from '../../services/api'
import QuillEditor from '../../components/QuillEditor'
import { getImageUrl } from '../../utils/config'

export default function HomeMenuForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    icon_url: '',
    content: '',
    order_num: 0,
  })
  const [iconPreview, setIconPreview] = useState('')
  const [iconFile, setIconFile] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [errors, setErrors] = useState({})

  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      const response = await homeMenuApi.getById(id)
      const item = response.data
      setFormData({
        title: item.title || '',
        icon_url: item.icon_url || '',
        content: item.content || '',
        order_num: item.order_num || 0,
      })
      if (item.icon_url) {
        setIconPreview(getImageUrl(item.icon_url))
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

  const handleIconChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target.result)
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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      let iconUrl = formData.icon_url

      if (iconFile) {
        const uploadResponse = await uploadApi.upload(iconFile)
        iconUrl = uploadResponse.data.url
      }

      const data = {
        title: formData.title,
        icon_url: iconUrl,
        content: formData.content,
        order_num: formData.order_num,
      }

      if (isEdit) {
        await homeMenuApi.update(id, data)
      } else {
        await homeMenuApi.create(data)
      }

      navigate('/home-menu')
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
        {isEdit ? '编辑菜单' : '添加菜单'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">
            上传图标 <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="w-full border rounded p-2"
          />
          {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
          {iconPreview && (
            <img
              src={iconPreview}
              alt="预览"
              className="mt-2 w-20 h-20 object-cover rounded"
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
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">排序</label>
          <input
            type="number"
            value={formData.order_num}
            onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">富文本内容</label>
          <QuillEditor value={formData.content} onChange={handleContentChange} />
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
            onClick={() => navigate('/home-menu')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}