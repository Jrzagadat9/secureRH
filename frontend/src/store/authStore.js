import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/login/', { email, password })
      const { access, refresh, user } = response.data
      
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      set({ user, isAuthenticated: true, loading: false, error: null })
      return { success: true }
    } catch (error) {
      console.error('Erreur connexion:', error)
      console.error('Réponse erreur:', error.response?.data)
      
      let errorMessage = 'Erreur de connexion'
      
      if (error.response?.data) {
        const data = error.response.data
        if (typeof data === 'object' && !data.detail && !data.message) {
          const errors = []
          for (const [field, messages] of Object.entries(data)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`)
            } else {
              errors.push(`${field}: ${messages}`)
            }
          }
          errorMessage = errors.join(' | ')
        } else {
          errorMessage = data.detail || data.message || data.non_field_errors?.[0] || JSON.stringify(data)
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      set({ loading: false, error: errorMessage })
      return { 
        success: false, 
        error: errorMessage
      }
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/register/', userData)
      const { access, refresh, user } = response.data
      
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      set({ user, isAuthenticated: true, loading: false, error: null })
      return { success: true }
    } catch (error) {
      console.error('Erreur inscription:', error)
      console.error('Réponse erreur:', error.response?.data)
      
      // Gérer les erreurs de validation Django
      let errorMessage = 'Erreur lors de l\'inscription'
      
      if (error.response?.data) {
        const data = error.response.data
        
        // Erreur de validation Django (format dict)
        if (typeof data === 'object' && !data.detail && !data.message) {
          const errors = []
          for (const [field, messages] of Object.entries(data)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`)
            } else {
              errors.push(`${field}: ${messages}`)
            }
          }
          errorMessage = errors.join(' | ')
        } else {
          errorMessage = data.detail || data.message || JSON.stringify(data)
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      set({ loading: false, error: errorMessage })
      return { 
        success: false, 
        error: errorMessage
      }
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false, error: null })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return
    }

    try {
      const response = await api.get('/auth/me/')
      set({ user: response.data, isAuthenticated: true })
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      set({ user: null, isAuthenticated: false })
    }
  },
}))

export default useAuthStore

