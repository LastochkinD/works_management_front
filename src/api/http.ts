import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
})

// Request interceptor - добавляем токен
apiClient.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_API_TOKEN
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - обработка ответов
apiClient.interceptors.response.use(
  (response) => {
    // Пробрасываем response.data
    return response.data
  },
  (error) => {
    // Обработка ошибок
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        // При 401 - редирект на страницу логина или показ уведомления
        window.location.href = '/login'
        return Promise.reject(new Error('Сессия истекла. Перенаправление...'))
      }
      
      if (status === 422 && data.errors) {
        return Promise.reject(data.errors)
      }
      
      if (data?.errors) {
        return Promise.reject(data.errors)
      }
      
      if (status === 500) {
        return Promise.reject(new Error('Внутренняя ошибка сервера. Попробуйте позже.'))
      }
      
      if (status === 404) {
        return Promise.reject(new Error('Ресурс не найден'))
      }
      
      return Promise.reject(new Error(data?.message || 'Произошла ошибка'))
    }
    
    // Сетевая ошибка
    return Promise.reject(new Error('Ошибка соединения с сервером. Проверьте подключение.'))
  }
)

// Добавляем методы для удобства
apiClient.get = apiClient.get.bind(apiClient)
apiClient.post = apiClient.post.bind(apiClient)
apiClient.put = apiClient.put.bind(apiClient)
apiClient.delete = apiClient.delete.bind(apiClient)

export default apiClient