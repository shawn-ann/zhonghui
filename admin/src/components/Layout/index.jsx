import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'

const navItems = [
  { path: '/carousel', label: '轮播图片管理' },
  { path: '/home-menu', label: '首页菜单管理' },
  { path: '/article', label: '文章管理' },
  { path: '/contact', label: '联系表单管理' },
]

export default function Layout() {
  const navigate = useNavigate()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    navigate('/login')
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('两次输入的新密码不一致')
      return
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('请填写所有字段')
      return
    }

    setPasswordLoading(true)
    try {
      await adminApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      alert('密码修改成功')
      setShowPasswordModal(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      setPasswordError(error.response?.data?.error || '密码修改失败')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-primary text-white px-5 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">管理后台</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm"
          >
            修改密码
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm"
          >
            退出登录
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <ul className="flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-5 py-3 text-gray-700 border-b-3 transition-colors ${
                    isActive
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent hover:bg-gray-50'
                  }`
                }
                end={item.path === '/carousel'}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-5">
        <Outlet />
      </main>

      {/* 修改密码 Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">修改密码</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordError('')
                  setPasswordSuccess(false)
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">当前密码</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">确认新密码</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {passwordError && (
                <div className="mb-4 text-red-500 text-sm">{passwordError}</div>
              )}

              {passwordSuccess && (
                <div className="mb-4 text-green-500 text-sm">密码修改成功</div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
                >
                  {passwordLoading ? '保存中...' : '保存'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordError('')
                    setPasswordSuccess(false)
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
