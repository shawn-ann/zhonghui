const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export { API_BASE_URL }
