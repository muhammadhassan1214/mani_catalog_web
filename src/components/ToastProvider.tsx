// filepath: d:\Beauty-Catelog\catalog-frontend\src\components\ToastProvider.tsx
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export type ToastKind = 'info' | 'success' | 'error'

export interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastContextValue {
  notify: (message: string, kind?: ToastKind, timeoutMs?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(1)

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback((message: string, kind: ToastKind = 'info', timeoutMs = 3500) => {
    const id = idRef.current++
    setToasts((t) => [...t, { id, kind, message }])
    if (timeoutMs > 0) {
      setTimeout(() => remove(id), timeoutMs)
    }
  }, [remove])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id}
               className={`pointer-events-auto flex items-start gap-3 rounded-md border px-3 py-2 shadow-md text-sm bg-white ${
                 t.kind === 'error' ? 'border-red-300 text-red-800' : t.kind === 'success' ? 'border-emerald-300 text-emerald-800' : 'border-gray-200 text-gray-800'
               }`}>
            <div className="flex-1">{t.message}</div>
            <button onClick={() => remove(t.id)} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

