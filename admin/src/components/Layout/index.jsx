import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/carousel', label: '轮播图片管理' },
  { path: '/article', label: '文章管理' },
  { path: '/contact', label: '联系表单管理' },
]

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-primary text-white px-5 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">管理后台</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm"
        >
          退出登录
        </button>
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
    </div>
  )
}
