import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { carouselApi } from '../../services/api'
import Pagination from '../../components/Pagination'

export default function Carousel() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await carouselApi.getList({ page, pageSize })
      setData(response.data.data || [])
      setTotal(response.data.total || 0)
    } catch (error) {
      console.error('获取轮播图失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除吗？')) return
    try {
      await carouselApi.delete(id)
      fetchData()
    } catch (error) {
      alert('删除失败，请重试')
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">轮播图片管理</h2>
        <Link
          to="/carousel/add"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          添加轮播图片
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">图片</th>
              <th className="text-left py-3 px-4">标题</th>
              <th className="text-left py-3 px-4">排序</th>
              <th className="text-left py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">加载中...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">暂无数据</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">
                    {item.image_url && (
                      <img
                        src={`http://localhost:3000${item.image_url}`}
                        alt={item.title}
                        className="w-24 h-14 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">{item.order_num || 0}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/carousel/edit/${item.id}`}
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
