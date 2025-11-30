import { useState } from 'react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'companies', label: 'Entreprises', icon: '🏢' },
    { id: 'audits', label: 'Audits Sécurité', icon: '🔒' },
    { id: 'rgpd', label: 'Conformité RGPD', icon: '📋' },
    { id: 'reports', label: 'Rapports', icon: '📈' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    setIsAuthenticated(true)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowLogin(true)
    setCurrentPage('dashboard')
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              SecureRH
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Plateforme de conformité RGPD
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-500 text-sm"
                onClick={() => setShowLogin(false)}
              >
                Créer un compte
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard SecureRH</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Entreprises</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Audits Réussis</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Actions Requises</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Score Moyen RGPD</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Actions Recommandées</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <div>
                    <p className="font-medium text-red-800">Mise à jour politique de confidentialité</p>
                    <p className="text-sm text-red-600">3 entreprises concernées</p>
                  </div>
                  <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">URGENT</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div>
                    <p className="font-medium text-yellow-800">Audit de sécurité annuel</p>
                    <p className="text-sm text-yellow-600">5 entreprises à contrôler</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded">MOYEN</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div>
                    <p className="font-medium text-blue-800">Formation RGPD équipe</p>
                    <p className="text-sm text-blue-600">Planifier pour Q1 2024</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">PLANIFIÉ</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'companies':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Nouvelle Entreprise
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secteur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score RGPD</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernier Audit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">T</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">TechCorp</div>
                          <div className="text-sm text-gray-500">techcorp@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Technologie</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">85%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15 Nov 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Voir</button>
                      <button className="text-green-600 hover:text-green-900">Audit</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">F</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">FinancePlus</div>
                          <div className="text-sm text-gray-500">contact@financeplus.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Finance</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">72%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08 Nov 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Voir</button>
                      <button className="text-green-600 hover:text-green-900">Audit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'audits':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Audits de Sécurité</h1>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                + Nouvel Audit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Audit TechCorp</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">TERMINÉ</span>
                </div>
                <p className="text-gray-600 mb-3">Audit de sécurité complet - 15 novembre 2023</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">92%</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Voir rapport</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Audit FinancePlus</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">EN COURS</span>
                </div>
                <p className="text-gray-600 mb-3">Audit RGPD - 08 novembre 2023</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-yellow-600">65%</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Continuer</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Audit DataSecure</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">PLANIFIÉ</span>
                </div>
                <p className="text-gray-600 mb-3">Audit annuel - Planifié pour décembre</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-400">--</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'rgpd':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Conformité RGPD</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Évaluation RGPD</h2>
                <p className="text-gray-600 mb-4">
                  Évaluez la conformité RGPD de votre entreprise avec notre questionnaire complet de 20 questions.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>0/20 questions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Commencer l'évaluation
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Score RGPD Global</h2>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">78%</div>
                  <p className="text-gray-600">Score moyen de conformité</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Collecte de données</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sécurité des données</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Droits des personnes</span>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Documentation</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Paramètres</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Sécurité Globale</h2>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Authentification à deux facteurs</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Chiffrement des données sensibles</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Logs d'audit avancés</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Alertes de sécurité</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Rapports périodiques</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Mises à jour système</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <div className="p-6"><h1 className="text-2xl font-bold">Page non trouvée</h1></div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold text-blue-600">SecureRH</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <span className="text-xl">{sidebarOpen ? '◁' : '▷'}</span>
            </button>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
