import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Wrapper compartilhado das telas públicas (Login, Registro, Esqueci/
// Redefinir senha, Verificar e-mail, Selecionar empresa) — hoje cada uma
// duplica o próprio `<main>` + card centralizado; isso substitui as 6
// cópias por um só lugar. Usado a partir da fase de Auth do redesenho
// (as páginas em si continuam com o visual antigo até lá).
export function AuthLayout({
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}: {
  title: string
  subtitle?: string
  children: ReactNode
  maxWidth?: string
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 dark:bg-canvas-dark">
      <div className={`w-full ${maxWidth}`}>
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-ink dark:text-ink-dark">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-forest text-sm font-display leading-none text-white dark:bg-forest-400">
            a
          </span>
          <span className="text-[17px] font-semibold tracking-tight">ATHLO</span>
        </Link>

        <div className="rounded-card border border-line bg-surface p-8 shadow-sm dark:border-line-dark dark:bg-surface-dark">
          <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-[13px] text-muted dark:text-muted-dark">{subtitle}</p> : null}

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  )
}
