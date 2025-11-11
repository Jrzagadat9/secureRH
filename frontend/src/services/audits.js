import api from './api'

export const auditsService = {
  // Liste des audits
  getAll: async (params = {}) => {
    const response = await api.get('/audits/', { params })
    return response.data
  },

  // Détails d'un audit
  getById: async (id) => {
    const response = await api.get(`/audits/${id}/`)
    return response.data
  },

  // Créer un audit
  create: async (data) => {
    const response = await api.post('/audits/', data)
    return response.data
  },

  // Déclencher un scan
  triggerScan: async (id, data) => {
    const response = await api.post(`/audits/${id}/trigger_scan/`, data)
    return response.data
  },

  // Récupérer les findings d'un audit
  getFindings: async (id) => {
    const response = await api.get(`/audits/${id}/findings/`)
    return response.data
  },

  // Statistiques
  getStats: async () => {
    const response = await api.get('/audits/stats/')
    return response.data
  },
}

export const findingsService = {
  // Liste des findings
  getAll: async (params = {}) => {
    const response = await api.get('/findings/', { params })
    return response.data
  },
}

