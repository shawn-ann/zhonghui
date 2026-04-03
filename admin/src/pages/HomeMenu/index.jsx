import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { homeMenuApi } from '../../services/api'

export default function HomeMenu() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await homeMenuApi.getList()
      setData(response.data || [])
    } catch (error) {
      console.error('获取菜单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除吗？')) return
    try {
      await homeMenuApi.delete(id)
      fetchData()
    } catch (error) {
      alert('删除失败，请重试')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">首页菜单管理</h2>
        <Link
          to="/home-menu/add"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          添加菜单
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无数据</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">ID</th>
              <th className="text-left py-3 px-2">图标</th>
              <th className="text-left py-3 px-2">标题</th>
              <th className="text-left py-3 px-2">排序</th>
              <th className="text-left py-3 px-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{item.id}</td>
                <td className="py-3 px-2">
                  {item.icon_url && (
                    <img
                      src={item.icon_url}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-2">{item.title}</td>
                <td className="py-3 px-2">{item.order_num}</td>
                <td className="py-3 px-2">
                  <Link
                    to={`/home-menu/edit/${item.id}`}
                    className="text-primary hover:underline mr-4"
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}