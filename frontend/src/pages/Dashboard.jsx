import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { auditsService } from '../services/audits'

function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [recentAudits, setRecentAudits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      loadData()
    }
  }, [isAuthenticated, navigate, checkAuth])

  const loadData = async () => {
    try {
      const [statsData, auditsData] = await Promise.all([
        auditsService.getStats(),
        auditsService.getAll({ ordering: '-created_at', page_size: 5 })
      ])
      setStats(statsData)
      setRecentAudits(auditsData.results || auditsData)
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue, {user?.first_name || user?.email} !
            </h2>
            <p className="text-gray-600">
              Tableau de bord de sécurité et conformité RGPD
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : (
            <>
              {/* Métriques */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">📊</span>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Audits</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.total_audits}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Terminés</dt>
                            <dd className="text-lg font-medium text-green-600">{stats.completed_audits}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">🔴</span>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Critiques</dt>
                            <dd className="text-lg font-medium text-red-600">{stats.critical_findings}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">⭐</span>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Score Moyen</dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {Math.round(stats.average_score || 0)}/100
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions rapides */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
                <div className="flex space-x-4">
                  <Link
                    to="/audits/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Nouvel Audit
                  </Link>
                  <Link
                    to="/audits"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Voir tous les audits
                  </Link>
                </div>
              </div>

              {/* Audits récents */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Audits Récents</h3>
                  <Link
                    to="/audits"
                    className="text-indigo-600 hover:text-indigo-500 text-sm"
                  >
                    Voir tout →
                  </Link>
                </div>
                {recentAudits.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun audit pour le moment.
                    <Link to="/audits/new" className="text-indigo-600 ml-1">
                      Créer votre premier audit
                    </Link>
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentAudits.map((audit) => (
                      <li key={audit.id} className="py-3">
                        <Link
                          to={`/audits/${audit.id}`}
                          className="flex justify-between items-center hover:text-indigo-600"
                        >
                          <div>
                            <p className="font-medium">{audit.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(audit.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs ${
                              audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                              audit.status === 'running' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {audit.status}
                            </span>
                            {audit.score !== null && (
                              <p className="text-sm text-gray-500 mt-1">
                                Score: {audit.score}/100
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
    </div>
  )
}

export default Dashboard

