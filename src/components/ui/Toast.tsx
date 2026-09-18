import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type ToastTone = 'info' | 'ok' | 'warn' | 'crit'
interface Toast { id: number; tone: ToastTone; title: string; message?: string }

interface ToastCtx {
  push: (t: Omit<Toast, 'id'>) => void
}

const Ctx = createContext<ToastCtx>({ push: () => {} })

export function useToast() {
  return useContext(Ctx)
}

const toneIcon: Record<ToastTone, 'info' | 'check' | 'alert' | 'alert'> = {
  info: 'info',
  ok: 'check',
  warn: 'alert',
  crit: 'alert',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const push = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { ...t, id }])
      window.setTimeout(() => remove(id), 4200)
    },
    [remove],
  )

  const value = useMemo(() => ({ push }), [push])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <span style={{ color: 'currentColor', marginTop: 1 }}>
              <Icon name={toneIcon[t.tone]} size={16} />
            </span>
            <div className="toast__msg">
              <div className="toast__title">{t.title}</div>
              {t.message && <div className="text-secondary" style={{ fontSize: 12.5 }}>{t.message}</div>}
            </div>
            <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => remove(t.id)} aria-label="Dismiss">
              <Icon name="close" size={12} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
