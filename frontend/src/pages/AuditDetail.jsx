import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { auditsService } from '../services/audits'

function AuditDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [audit, setAudit] = useState(null)
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    loadAudit()
  }, [id])

  const loadAudit = async () => {
    try {
      setLoading(true)
      const data = await auditsService.getById(id)
      setAudit(data)
      setFindings(data.findings || [])
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement de l\'audit')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTriggerScan = async () => {
    if (!audit.target) {
      alert('Veuillez définir une cible pour l\'audit')
      return
    }

    try {
      setScanning(true)
      await auditsService.triggerScan(id, {
        target: audit.target,
        scan_type: 'full'
      })
      // Recharger l'audit après quelques secondes
      setTimeout(() => {
        loadAudit()
        setScanning(false)
      }, 2000)
    } catch (err) {
      setError('Erreur lors du déclenchement du scan')
      setScanning(false)
      console.error(err)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      info: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error && !audit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/audits')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Retour aux audits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <button
              onClick={() => navigate('/audits')}
              className="text-indigo-600 hover:text-indigo-500 mb-4"
            >
              ← Retour aux audits
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{audit.name}</h1>
                <p className="text-gray-500 mt-1">{audit.description || 'Aucune description'}</p>
              </div>
              {audit.status !== 'running' && (
                <button
                  onClick={handleTriggerScan}
                  disabled={scanning || !audit.target}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {scanning ? 'Scan en cours...' : 'Déclencher un scan'}
                </button>
              )}
            </div>
          </div>

          {/* Informations de l'audit */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Informations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{audit.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <p className="font-medium">{audit.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-medium">{audit.score !== null ? `${audit.score}/100` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Findings</p>
                <p className="font-medium">{audit.total_findings}</p>
              </div>
            </div>
            {audit.target && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Cible</p>
                <p className="font-medium">{audit.target}</p>
              </div>
            )}
          </div>

          {/* Findings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Vulnérabilités Détectées</h2>
            {findings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {audit.status === 'pending' || audit.status === 'running'
                  ? 'Scan en cours...'
                  : 'Aucune vulnérabilité détectée'}
              </p>
            ) : (
              <div className="space-y-4">
                {findings.map((finding) => (
                  <div
                    key={finding.id}
                    className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{finding.title}</h3>
                      <span className="px-2 py-1 rounded text-xs font-medium">
                        {finding.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{finding.description}</p>
                    {finding.recommendation && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm font-medium">Recommandation:</p>
                        <p className="text-sm">{finding.recommendation}</p>
                      </div>
                    )}
                    <div className="mt-2 flex space-x-4 text-xs">
                      {finding.cwe && <span>CWE: {finding.cwe}</span>}
                      {finding.cvss && <span>CVSS: {finding.cvss}</span>}
                      {finding.category && <span>Catégorie: {finding.category}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default AuditDetail

