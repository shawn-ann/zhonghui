import { useState, useEffect } from 'react'
import { contactApi } from '../../services/api'
import Pagination from '../../components/Pagination'

export default function Contact() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await contactApi.getList({ page, pageSize })
      setData(response.data.data.contacts || [])
      setTotal(response.data.data.total || 0)
    } catch (error) {
      console.error('获取联系表单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">联系表单管理</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">ID</th>
              <th className="text-left py-3 px-2">姓名</th>
              <th className="text-left py-3 px-2">生日</th>
              <th className="text-left py-3 px-2">意向项目</th>
              <th className="text-left py-3 px-2">最高学历</th>
              <th className="text-left py-3 px-2">符合条件</th>
              <th className="text-left py-3 px-2">英语水平</th>
              <th className="text-left py-3 px-2">英语成绩</th>
              <th className="text-left py-3 px-2">育儿经验</th>
              <th className="text-left py-3 px-2">所在城市</th>
              <th className="text-left py-3 px-2">联系方式</th>
              <th className="text-left py-3 px-2">提交时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center py-8">加载中...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-8 text-gray-500">暂无数据</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{item.id}</td>
                  <td className="py-3 px-2">{item.name}</td>
                  <td className="py-3 px-2">{item.birthday}</td>
                  <td className="py-3 px-2">{item.projects || item.intended_programs}</td>
                  <td className="py-3 px-2">{item.education || item.highest_education}</td>
                  <td className="py-3 px-2">{item.conditions}</td>
                  <td className="py-3 px-2">{item.english_level || item.englishLevel}</td>
                  <td className="py-3 px-2">{item.english_score || item.englishScore || '-'}</td>
                  <td className="py-3 px-2">{item.childcare_exp || item.childcareExp}</td>
                  <td className="py-3 px-2">{item.city}</td>
                  <td className="py-3 px-2">{item.contact}</td>
                  <td className="py-3 px-2">{formatDate(item.created_at)}</td>
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
