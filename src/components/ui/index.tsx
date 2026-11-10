import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Loader2, X } from 'lucide-react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-card border border-line bg-surface dark:border-line-dark dark:bg-surface-dark ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 dark:border-line-dark">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[12.5px] text-muted dark:text-muted-dark">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
  // associa a um <form> fora da árvore do botão (ex.: botão no footer do
  // Modal, que fica fora do <form> que envolve o conteúdo)
  form?: string
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  form,
  disabled,
  loading,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = size === 'sm' ? 'px-2.5 py-1.5 text-[12.5px]' : 'px-3.5 py-2 text-[13px]'
  const variants = {
    primary: 'bg-forest text-white hover:bg-forest-600 dark:bg-forest-400 dark:hover:bg-forest-500',
    ghost:
      'border border-line bg-surface text-ink hover:border-forest-600/40 hover:text-forest-600 dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark dark:hover:border-forest-400/50 dark:hover:text-forest-400',
    danger:
      'border border-[#E7C9C4] bg-white text-danger hover:bg-[#F9EDEB] dark:border-danger-dark/40 dark:bg-surface-dark dark:text-danger-dark dark:hover:bg-danger-dark/10',
  }[variant]

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes} ${variants} ${className}`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      {children}
    </button>
  )
}

export type BadgeTone = 'neutral' | 'positive' | 'warn' | 'negative' | 'info' | 'accent' | 'purple'

// 5 tons vêm da referência (neutral/positive/warn/negative/info); accent
// e purple foram adicionados porque Pedidos usa 6 status diferentes
// (CONFIRMED=ciano, OUT_FOR_DELIVERY=roxo) e colapsar pra 4 cores perdia
// a distinção visual que já existia.
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  const tones = {
    neutral: 'bg-[#F0EEE8] text-muted dark:bg-white/[0.06] dark:text-muted-dark',
    positive: 'bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400',
    warn: 'bg-[#F5EDDD] text-[#8A6414] dark:bg-[#3A2F14] dark:text-[#E8C468]',
    negative: 'bg-[#F6E4E1] text-danger dark:bg-danger-dark/15 dark:text-danger-dark',
    info: 'bg-[#E8EDF3] text-[#3B5B7A] dark:bg-[#1B2A38] dark:text-[#8CB3D9]',
    accent: 'bg-[#E0F2FE] text-[#0E7490] dark:bg-[#0C2B33] dark:text-[#67D4F0]',
    purple: 'bg-[#F0E7FB] text-[#7E3FC2] dark:bg-[#2A1F3D] dark:text-[#C9A6F5]',
  }[tone]
  return <span className={`inline-block rounded px-1.5 py-0.5 text-[11.5px] font-medium ${tones}`}>{children}</span>
}

export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6">
      <button aria-label="Fechar" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-xl border border-line bg-surface sm:max-w-lg sm:rounded-card dark:border-line-dark dark:bg-surface-dark"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 dark:border-line-dark">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-[12.5px] text-muted dark:text-muted-dark">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded text-muted transition hover:bg-[#F0EEE8] hover:text-ink dark:text-muted-dark dark:hover:bg-white/[0.06] dark:hover:text-ink-dark"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-line px-5 py-3.5 dark:border-line-dark">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function Field({
  label,
  children,
  hint,
  className = '',
}: {
  label: string
  children: ReactNode
  hint?: string
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-muted dark:text-muted-dark">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11.5px] text-faint dark:text-faint-dark">{hint}</span> : null}
    </label>
  )
}

export const inputClass =
  'w-full rounded-md border border-line bg-surface px-3 py-2 text-[13.5px] text-ink outline-none transition placeholder:text-faint focus:border-forest-600/50 focus:ring-2 focus:ring-forest-600/15 dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-faint-dark dark:focus:border-forest-400/50 dark:focus:ring-forest-400/15'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#F0EEE8] text-muted dark:bg-white/[0.06] dark:text-muted-dark">
        {icon}
      </span>
      <p className="text-[14px] font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-[12.5px] leading-relaxed text-muted dark:text-muted-dark">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#F9EDEB] px-5 py-3 text-[12.5px] text-danger dark:border-line-dark dark:bg-danger-dark/10 dark:text-danger-dark">
      <span>{message}</span>
      {onRetry ? (
        <button onClick={onRetry} className="font-medium underline underline-offset-2">
          Tentar de novo
        </button>
      ) : null}
    </div>
  )
}

export function SkeletonRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse divide-y divide-line dark:divide-line-dark">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-3.5">
          {Array.from({ length: cols }).map((__, c) => (
            <div
              key={c}
              className={`h-3 rounded bg-[#F0EEE8] dark:bg-white/[0.06] ${c === 0 ? 'w-1/3' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">{children}</div>
}

export function StatStrip({
  items,
}: {
  items: { label: string; value: string; note?: string; tone?: 'default' | 'warn' | 'danger' }[]
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line dark:border-line-dark dark:bg-line-dark sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-surface p-5 dark:bg-surface-dark">
          <p className="text-[12.5px] text-muted dark:text-muted-dark">{item.label}</p>
          <p
            className={`mt-2 font-display text-[28px] leading-none tracking-tight tabular-nums ${
              item.tone === 'danger'
                ? 'text-danger dark:text-danger-dark'
                : item.tone === 'warn'
                  ? 'text-clay dark:text-clay-dark'
                  : 'text-ink dark:text-ink-dark'
            }`}
          >
            {item.value}
          </p>
          {item.note ? (
            <p className="mt-2 text-[11.5px] leading-snug text-faint dark:text-faint-dark">{item.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

// Conjunto fino de wrappers de tabela — a referência não tem um
// componente de tabela genérico (cada página dela reimplementa o
// próprio <table>, só que todas com o mesmo estilo); isso evita repetir
// a mesma string de classe em cada página que listamos.
export function Table({ children, minWidth = 640 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth }}>
        {children}
      </table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>
}

export function Th({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' | 'center' }) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  return (
    <th className={`border-b border-line px-5 py-2.5 text-[11.5px] font-medium text-faint first:pl-5 ${alignClass} dark:border-line-dark dark:text-faint-dark`}>
      {children}
    </th>
  )
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line dark:divide-line-dark">{children}</tbody>
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="text-[13px] transition hover:bg-[#FBF9F4] dark:hover:bg-white/[0.03]">{children}</tr>
}

export function Td({
  children,
  align = 'left',
  className = '',
}: {
  children: ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  return <td className={`px-5 py-3 ${alignClass} ${className}`}>{children}</td>
}
