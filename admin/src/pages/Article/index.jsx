import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { articleApi } from '../../services/api'
import Pagination from '../../components/Pagination'
import { getImageUrl } from '../../utils/config'

export default function Article() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [articleType, setArticleType] = useState('')
  const pageSize = 10

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page, pageSize }
      if (keyword) params.keyword = keyword
      if (articleType) params.articleType = articleType
      
      const response = await articleApi.getList(params)
      setData(response.data.data || [])
      setTotal(response.data.total || 0)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, articleType])

  const handleSearch = () => {
    setPage(1)
    fetchData()
  }

  const handleReset = () => {
    setKeyword('')
    setArticleType('')
    setPage(1)
    fetchData()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除吗？')) return
    try {
      await articleApi.delete(id)
      fetchData()
    } catch (error) {
      alert('删除失败，请重试')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  const typeText = (type) => (type === 'case' ? '案例分享' : '问答文章')

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">文章管理</h2>
        <Link
          to="/article/add"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          添加文章
        </Link>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={articleType}
          onChange={(e) => {
            setArticleType(e.target.value)
            setPage(1)
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">全部类型</option>
          <option value="case">案例分享</option>
          <option value="qa">问答文章</option>
        </select>
        
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索标题关键字..."
          className="border rounded px-3 py-2 flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <button
          onClick={handleSearch}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          搜索
        </button>
        
        <button
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          重置
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">图片</th>
              <th className="text-left py-3 px-4">标题</th>
              <th className="text-left py-3 px-4">类型</th>
              <th className="text-left py-3 px-4">发布日期</th>
              <th className="text-left py-3 px-4">浏览次数</th>
              <th className="text-left py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8">加载中...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">暂无数据</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">
                    {item.image_url && (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">{typeText(item.article_type)}</td>
                  <td className="py-3 px-4">{formatDate(item.publish_date)}</td>
                  <td className="py-3 px-4">{item.view_count || 0}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/article/edit/${item.id}`}
                      className="text-primary hover:underline mr-3"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
