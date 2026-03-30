import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Carousel from './pages/Carousel'
import CarouselForm from './pages/Carousel/Form'
import Article from './pages/Article'
import ArticleForm from './pages/Article/Form'
import Contact from './pages/Contact'

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('adminLoggedIn')
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/carousel" replace />} />
        <Route path="carousel" element={<Carousel />} />
        <Route path="carousel/add" element={<CarouselForm key="carousel-add" />} />
        <Route path="carousel/edit/:id" element={<CarouselForm key="carousel-edit" />} />
        <Route path="article" element={<Article />} />
        <Route path="article/add" element={<ArticleForm key="article-add" />} />
        <Route path="article/edit/:id" element={<ArticleForm key="article-edit" />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App
