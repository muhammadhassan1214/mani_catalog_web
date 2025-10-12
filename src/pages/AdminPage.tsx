// filepath: d:\Beauty-Catelog\catalog-frontend\src\pages\AdminPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { adminCreateProduct, adminDeleteMessage, adminListMessages, adminSetMessageRead, type AdminMessage } from '../lib/api'

function useAdminPassword() {
  const [pwd, setPwd] = useState<string>(() => localStorage.getItem('adminPassword') || '')
  const save = (v: string) => { setPwd(v); localStorage.setItem('adminPassword', v) }
  const clear = () => { setPwd(''); localStorage.removeItem('adminPassword') }
  return { pwd, setPwd: save, clear }
}

export default function AdminPage() {
  const { notify } = useToast()
  const { pwd, setPwd, clear } = useAdminPassword()
  const [status, setStatus] = useState<'all' | 'read' | 'unread'>('all')
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  // Product form state (minimal fields)
  const [prod, setProd] = useState({
    id: '',
    name: '',
    sku: '',
    category: '',
    price: '',
    imageUrl: '',
    imageAlt: '',
    shortDescription: '',
  })

  const canCreate = useMemo(() => prod.id && prod.name && prod.sku && prod.category && prod.imageUrl, [prod])

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
  }, [pwd, status, refresh])

  const onMark = async (id: string, isRead: boolean) => {
    try {
      await adminSetMessageRead(pwd, id, isRead)
      setMessages((ms) => ms.map(m => m.id === id ? { ...m, isRead } : m))
    } catch (e) {
      notify('Failed to update message', 'error')
    }
  }

  const onDelete = async (id: string) => {
    try {
      await adminDeleteMessage(pwd, id)
      setMessages((ms) => ms.filter(m => m.id !== id))
    } catch (e) {
      notify('Failed to delete message', 'error')
    }
  }

  const onCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return
    try {
      await adminCreateProduct(pwd, {
        id: prod.id,
        name: prod.name,
        sku: prod.sku,
        category: prod.category,
        price: prod.price ? Number(prod.price) : undefined,
        shortDescription: prod.shortDescription || undefined,
        images: [{ url: prod.imageUrl, alt: prod.imageAlt || prod.name }],
      })
      notify('Product created', 'success')
      setProd({ id: '', name: '', sku: '', category: '', price: '', imageUrl: '', imageAlt: '', shortDescription: '' })
    } catch (e) {
      notify('Failed to create product', 'error')
    }
  }

  if (!pwd || authError) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin</h1>
        <p className="mt-1 text-sm text-gray-600">Enter admin password to continue.</p>
        <form className="mt-4 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); setRefresh((x) => x + 1) }}>
          <input type="password" placeholder="Password" className="rounded-md border border-gray-300 px-3 py-2 text-sm" value={pwd}
                 onChange={(e) => setPwd(e.target.value)} />
          <button className="rounded-md bg-brand-700 text-white text-sm px-3 py-2">Continue</button>
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
        <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => { clear(); setMessages([]) }}>Log out</button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Filter</label>
              <select className="rounded-md border border-gray-300 px-2 py-1 text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
              <button onClick={() => setRefresh((x) => x + 1)} className="text-sm rounded-md border px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-50">Refresh</button>
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
                      <div className="font-medium text-gray-900">{m.name} <span className="text-gray-500">&lt;{m.email}&gt;</span>{m.company ? <span className="text-gray-500"> · {m.company}</span> : null}</div>
                      <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs rounded-full px-2 py-1 border ${m.isRead ? 'text-gray-700 border-gray-300' : 'text-blue-700 border-blue-300'}`}>{m.isRead ? 'Read' : 'Unread'}</span>
                      <button onClick={() => onMark(m.id, !m.isRead)} className="text-xs rounded-md border px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-50">Mark {m.isRead ? 'Unread' : 'Read'}</button>
                      <button onClick={() => onDelete(m.id)} className="text-xs rounded-md border px-2 py-1 border-red-300 text-red-700 hover:bg-red-50">Delete</button>
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
              <label className="block text-sm font-medium">ID</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.id} onChange={(e) => setProd({ ...prod, id: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.name} onChange={(e) => setProd({ ...prod, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.sku} onChange={(e) => setProd({ ...prod, sku: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.category} onChange={(e) => setProd({ ...prod, category: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Price (optional)</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.price} onChange={(e) => setProd({ ...prod, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Short Description (optional)</label>
              <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.shortDescription} onChange={(e) => setProd({ ...prod, shortDescription: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.imageUrl} onChange={(e) => setProd({ ...prod, imageUrl: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Image Alt (optional)</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={prod.imageAlt} onChange={(e) => setProd({ ...prod, imageAlt: e.target.value })} />
            </div>
            <button disabled={!canCreate} className="w-full rounded-md bg-brand-700 text-white text-sm py-2 disabled:opacity-60">Create</button>
          </form>
          <p className="mt-2 text-xs text-gray-500">Note: If the category does not exist, it will be created automatically.</p>
        </section>
      </div>
    </div>
  )
}

