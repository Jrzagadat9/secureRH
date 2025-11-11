import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auditsService } from '../services/audits'

function Audits() {
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAudits()
  }, [])

  const loadAudits = async () => {
    try {
      setLoading(true)
      const response = await auditsService.getAll()
      setAudits(response.results || response)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des audits')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type) => {
    const colors = {
      technical: 'bg-purple-100 text-purple-800',
      organizational: 'bg-indigo-100 text-indigo-800',
      rgpd: 'bg-blue-100 text-blue-800',
      compliance: 'bg-green-100 text-green-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des audits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Audits de Sécurité</h1>
            <Link
              to="/audits/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Nouvel Audit
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {audits.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Aucun audit pour le moment.</p>
              <Link
                to="/audits/new"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Créer votre premier audit
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {audits.map((audit) => (
                  <li key={audit.id}>
                    <Link
                      to={`/audits/${audit.id}`}
                      className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(audit.type)}`}>
                              {audit.type === 'technical' ? '🔍' : audit.type === 'rgpd' ? '📋' : '📊'} {audit.type}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {audit.name}
                              </p>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                                {audit.status}
                              </span>
                            </div>
                            {audit.target && (
                              <p className="text-sm text-gray-500 mt-1">
                                Cible: {audit.target}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {audit.score !== null && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                Score: {audit.score}/100
                              </p>
                              <p className="text-xs text-gray-500">
                                {audit.total_findings} findings
                              </p>
                            </div>
                          )}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(audit.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      {audit.total_findings > 0 && (
                        <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                          {audit.critical_count > 0 && (
                            <span className="text-red-600">
                              🔴 {audit.critical_count} Critique{audit.critical_count > 1 ? 's' : ''}
                            </span>
                          )}
                          {audit.high_count > 0 && (
                            <span className="text-orange-600">
                              🟠 {audit.high_count} Élevée{audit.high_count > 1 ? 's' : ''}
                            </span>
                          )}
                          {audit.medium_count > 0 && (
                            <span className="text-yellow-600">
                              🟡 {audit.medium_count} Moyenne{audit.medium_count > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
    </div>
  )
}

export default Audits

