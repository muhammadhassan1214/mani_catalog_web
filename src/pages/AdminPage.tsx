// filepath: d:\Beauty-Catelog\catalog-frontend\src\pages\AdminPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import {
  adminCreateProduct,
  adminDeleteMessage,
  adminListMessages,
  adminSetMessageRead,
  adminImportCsv,
  type AdminMessage,
} from '../lib/api'

function useAdminPassword() {
  const [pwd, setPwd] = useState<string>(() => localStorage.getItem('adminPassword') || '')
  const save = (v: string) => { setPwd(v); localStorage.setItem('adminPassword', v) }
  const clear = () => { setPwd(''); localStorage.removeItem('adminPassword') }
  return { pwd, setPwd: save, clear }
}

export default function AdminPage() {
  const { notify } = useToast()
  const { pwd, setPwd, clear } = useAdminPassword()

  // Messages state
  const [status, setStatus] = useState<'all' | 'read' | 'unread'>('all')
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  // Create product form (new schema)
  const [prod, setProd] = useState({
    id: '',
    name: '',
    image: '',
    desc_size: '',
    desc_category: '',
    desc_finish: '',
    desc_details: '',
  })

  // CSV import state
  const [csvText, setCsvText] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [skipExisting, setSkipExisting] = useState(true)
  const [resetBefore, setResetBefore] = useState(false)

  const canCreate = useMemo(() => prod.id && prod.name, [prod.id, prod.name])

  // Load messages when authenticated
  useEffect(() => {
    if (!pwd) return
    const ac = new AbortController()
    setLoading(true)
    setAuthError(null)
    adminListMessages(pwd, status, ac.signal)
      .then(setMessages)
      .catch((e) => {
        if (e.message === 'Unauthorized') setAuthError('Invalid password')
        else notify('Failed to load messages', 'error')
      })
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [pwd, status, refresh, notify])

  // Message actions
  const onMark = async (id: string, isRead: boolean) => {
    try {
      await adminSetMessageRead(pwd, id, isRead)
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, isRead } : m)))
    } catch {
      notify('Failed to update message', 'error')
    }
  }

  const onDelete = async (id: string) => {
    try {
      await adminDeleteMessage(pwd, id)
      setMessages((ms) => ms.filter((m) => m.id !== id))
    } catch {
      notify('Failed to delete message', 'error')
    }
  }

  // Product actions
  const onCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return
    try {
      await adminCreateProduct(pwd, {
        id: prod.id,
        name: prod.name,
        image: prod.image || undefined,
        description: {
          ...(prod.desc_size ? { size: prod.desc_size } : {}),
          ...(prod.desc_category ? { category: prod.desc_category } : {}),
          ...(prod.desc_finish ? { finish: prod.desc_finish } : {}),
          ...(prod.desc_details ? { details: prod.desc_details } : {}),
        }
      })
      notify('Product created', 'success')
      setProd({ id: '', name: '', image: '', desc_size: '', desc_category: '', desc_finish: '', desc_details: '' })
    } catch {
      notify('Failed to create product', 'error')
    }
  }

  // Login view with candidate password; do not store until validated
  const [candidatePwd, setCandidatePwd] = useState('')
  if (!pwd || authError) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin</h1>
        <p className="mt-1 text-sm text-gray-600">Enter admin password to continue.</p>
        <form
          className="mt-4 flex items-center gap-2"
          autoComplete="off"
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            setAuthError(null)
            try {
              await adminListMessages(candidatePwd, 'all')
              setPwd(candidatePwd) // save only after successful validation
              setCandidatePwd('')
            } catch (err: any) {
              setAuthError(err?.message === 'Unauthorized' ? 'Invalid password' : 'Login failed')
            } finally {
              setLoading(false)
            }
          }}
        >
          <input
            type="password"
            placeholder="Password"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={candidatePwd}
            onChange={(e) => setCandidatePwd(e.target.value)}
            autoComplete="new-password"
          />
          <button className="rounded-md bg-brand-700 text-white text-sm px-3 py-2" disabled={loading}>
            {loading ? 'Checking…' : 'Continue'}
          </button>
        </form>
        {authError && <div className="mt-2 text-sm text-red-600">{authError}</div>}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin</h1>
          <p className="mt-1 text-sm text-gray-600">Manage contact messages and create products.</p>
        </div>
        <button
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={() => {
            clear()
            setMessages([])
          }}
        >
          Log out
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Filter</label>
              <select
                className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as never)}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
              <button
                onClick={() => setRefresh((x) => x + 1)}
                className="text-sm rounded-md border px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
          {loading ? (
            <div className="mt-3 text-sm text-gray-600">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="mt-3 text-sm text-gray-600">No messages</div>
          ) : (
            <ul className="mt-3 divide-y rounded-md border bg-white">
              {messages.map((m) => (
                <li key={m.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {m.name} <span className="text-gray-500">&lt;{m.email}&gt;</span>
                        {m.company ? <span className="text-gray-500"> · {m.company}</span> : null}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs rounded-full px-2 py-1 border ${
                          m.isRead ? 'text-gray-700 border-gray-300' : 'text-blue-700 border-blue-300'
                        }`}
                      >
                        {m.isRead ? 'Read' : 'Unread'}
                      </span>
                      <button
                        onClick={() => onMark(m.id, !m.isRead)}
                        className="text-xs rounded-md border px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Mark {m.isRead ? 'Unread' : 'Read'}
                      </button>
                      <button
                        onClick={() => { if (window.confirm('Delete this message permanently?')) onDelete(m.id) }}
                        className="text-xs rounded-md border px-2 py-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Create Product</h2>
          <form className="mt-3 space-y-3 rounded-md border bg-white p-4" onSubmit={onCreateProduct}>
            <div>
              <label className="block text-sm font-medium">ID (SKU)</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={prod.id}
                onChange={(e) => setProd({ ...prod, id: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={prod.name}
                onChange={(e) => setProd({ ...prod, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={prod.image}
                onChange={(e) => setProd({ ...prod, image: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium">Description · Size</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.desc_size} onChange={(e) => setProd({ ...prod, desc_size: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Description · Category</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.desc_category} onChange={(e) => setProd({ ...prod, desc_category: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Description · Finish</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.desc_finish} onChange={(e) => setProd({ ...prod, desc_finish: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Description · Details</label>
                <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} value={prod.desc_details} onChange={(e) => setProd({ ...prod, desc_details: e.target.value })} />
              </div>
            </div>

            <button
              disabled={!canCreate}
              className="w-full rounded-md bg-brand-700 text-white text-sm py-2 disabled:opacity-60"
            >
              Create
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500">
            Note: Base category is derived automatically from the name.
          </p>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900">Import from CSV</h3>
            <div className="mt-2 space-y-2 rounded-md border bg-white p-3">
              <label className="block text-sm text-gray-700">Upload file</label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setCsvFile(e.currentTarget.files?.[0] || null)}
                className="block w-full text-sm"
              />
              <div className="text-xs text-gray-500">or paste CSV content below</div>
              <textarea
                rows={5}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder={'Name,SKU,Image URL, ,{"size":"...","category":"...","finish":"...","details":"..."}'}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={skipExisting} onChange={(e) => setSkipExisting(e.target.checked)} />
                  Skip existing SKUs
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={resetBefore} onChange={(e) => setResetBefore(e.target.checked)} />
                  Reset products before import
                </label>
              </div>
              <div>
                <button
                  className="rounded-md bg-brand-700 text-white text-sm px-3 py-2"
                  onClick={async () => {
                    try {
                      let csv = csvText.trim()
                      if (!csv && csvFile) {
                        csv = await csvFile.text()
                      }
                      if (!csv) {
                        notify('Please choose a CSV file or paste CSV text', 'error')
                        return
                      }
                      const res = await adminImportCsv(pwd, csv, { reset: resetBefore, skipExisting })
                      alert(`Import finished\nInserted: ${res.inserted}\nSkipped: ${res.skipped}${res.duplicates.length ? `\nDuplicates: ${res.duplicates.slice(0, 20).join(', ')}${res.duplicates.length > 20 ? '…' : ''}` : ''}`)
                      setCsvFile(null)
                      setCsvText('')
                      setRefresh((x) => x + 1)
                    } catch (e) {
                      notify('CSV import failed', 'error')
                    }
                  }}
                >
                  Import CSV
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
