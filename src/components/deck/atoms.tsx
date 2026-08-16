import type { CSSProperties, ReactNode } from 'react'

// ---------- Slide wrapper ----------

export function Slide({
  num,
  section,
  title,
  subtitle,
  children,
  className,
}: {
  num: string
  section: string
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={'slide' + (className ? ' ' + className : '')}>
      <header className="slide-head">
        <span className="slide-num">{num}</span>
        <div>
          <span className="slide-section">{section}</span>
          <h2 className="slide-title">{title}</h2>
          {subtitle ? <p className="slide-subtitle">{subtitle}</p> : null}
        </div>
      </header>
      <div className="slide-body">{children}</div>
    </section>
  )
}

// ---------- Panel ----------

export function Panel({
  title,
  children,
  className,
}: {
  title?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={'panel' + (className ? ' ' + className : '')}>
      {title ? <div className="panel-title">{title}</div> : null}
      {children}
    </div>
  )
}

// ---------- Character board ----------

function cellClass(base: string, state?: 'match' | 'mismatch'): string {
  if (state === 'match') return base + ' match'
  if (state === 'mismatch') return base + ' mismatch'
  return base
}

export function CharBoard({
  text,
  pattern,
  offset = 0,
  i = -1,
  j = -1,
  marks = false,
  marksUpTo,
  showIndexes = false,
  patternLabel,
  className,
}: {
  text: string
  pattern: string
  offset?: number
  i?: number
  j?: number
  marks?: boolean
  /** mostra marcas ✓/✗ apenas até esta posição (inclusivo), útil para animações */
  marksUpTo?: number
  showIndexes?: boolean
  patternLabel?: string
  className?: string
}) {
  const n = text.length
  const m = pattern.length
  const cols = Math.max(n, offset + m)
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, var(--cell))`,
  }

  let row = 1
  const idxRow = showIndexes ? row++ : 0
  const marksRow = marks ? row++ : 0
  const textRow = row++
  const patternRow = row++

  const cells: ReactNode[] = []

  if (showIndexes) {
    for (let k = 0; k < cols; k++) {
      cells.push(
        <div
          key={'ix' + k}
          className="cell idx"
          style={{ gridRow: idxRow, gridColumn: k + 1 }}
        >
          {k}
        </div>,
      )
    }
  }

  if (marks) {
    for (let k = 0; k < cols; k++) {
      const rel = k - offset
      let content: ReactNode = ''
      let state: 'match' | 'mismatch' | undefined
      if (rel >= 0 && rel < m && (marksUpTo === undefined || rel <= marksUpTo)) {
        const ok = text[k] === pattern[rel]
        content = ok ? '✓' : '✗'
        state = ok ? 'match' : 'mismatch'
      }
      cells.push(
        <div
          key={'mk' + k}
          className={cellClass('cell', state)}
          style={{ gridRow: marksRow, gridColumn: k + 1 }}
        >
          {content}
        </div>,
      )
    }
  }

  for (let k = 0; k < n; k++) {
    const rel = k - offset
    const isActive = k === i
    const isCompare =
      isActive && rel >= 0 && rel < m && text[k] === pattern[rel]
        ? 'match'
        : isActive && rel >= 0 && rel < m && text[k] !== pattern[rel]
          ? 'mismatch'
          : undefined
    cells.push(
      <div
        key={'t' + k}
        className={cellClass('cell', isCompare) + (isActive ? ' active' : '')}
        style={{ gridRow: textRow, gridColumn: k + 1 }}
      >
        {text[k]}
      </div>,
    )
  }

  if (patternLabel) {
    cells.push(
      <div
        key="pl"
        className="cell idx"
        style={{ gridRow: patternRow, gridColumn: 1 }}
      >
        {patternLabel}
      </div>,
    )
  }

  for (let k = 0; k < m; k++) {
    const pCol = offset + k + 1
    const isActive = k === j
    const state =
      isActive && i >= 0 && text[i] === pattern[k]
        ? 'match'
        : isActive && i >= 0 && text[i] !== pattern[k]
          ? 'mismatch'
          : undefined
    const dim = offset + k >= n
    cells.push(
      <div
        key={'p' + k}
        className={cellClass('cell', state) + (isActive ? ' active' : '') + (dim ? ' dim' : '')}
        style={{ gridRow: patternRow, gridColumn: pCol }}
      >
        {pattern[k]}
      </div>,
    )
  }

  return (
    <div className={'board' + (className ? ' ' + className : '')} style={gridStyle}>
      {cells}
    </div>
  )
}

// ---------- LPS table ----------

export function LpsTable({
  pattern,
  lps,
  highlight,
  className,
}: {
  pattern: string
  lps: number[]
  highlight?: number
  className?: string
}) {
  const m = pattern.length
  const style: CSSProperties = {
    ['--m' as string]: String(m),
  }
  return (
    <div className={'lps-table' + (className ? ' ' + className : '')} style={style}>
      <div className="lps-cell lbl" style={{ gridColumn: '1 / -1' }}>
        P
      </div>
      {Array.from(pattern).map((_, k) => (
        <div
          key={'p' + k}
          className={'lps-cell pattern' + (k === highlight ? ' hot' : '')}
        >
          {pattern[k]}
        </div>
      ))}
      <div className="lps-cell lbl" style={{ gridColumn: '1 / -1' }}>
        índice
      </div>
      {Array.from(pattern).map((_, k) => (
        <div key={'x' + k} className="lps-cell lbl">
          {k}
        </div>
      ))}
      <div className="lps-cell lbl" style={{ gridColumn: '1 / -1' }}>
        LPS
      </div>
      {Array.from(pattern).map((_, k) => (
        <div
          key={'l' + k}
          className={'lps-cell value' + (k === highlight ? ' hot' : '')}
        >
          {lps[k]}
        </div>
      ))}
    </div>
  )
}

// ---------- Flow (Falha → LPS → …) ----------

export function Flow({
  steps,
  current,
  matchAt,
}: {
  steps: string[]
  current: number
  matchAt?: number
}) {
  return (
    <div className="flow">
      {steps.map((s, k) => {
        const cls =
          matchAt !== undefined && k <= matchAt
            ? 'flow-step match'
            : k === current
              ? 'flow-step current'
              : 'flow-step'
        return (
          <div key={k}>
            <div className={cls}>
              <span className="ph">{String(k + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </div>
            {k < steps.length - 1 ? (
              <div className="flow-arrow">↓</div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

// ---------- Comparison row ----------

export function CmpRow({
  textCh,
  patternCh,
  ok,
  label,
}: {
  textCh: string
  patternCh: string
  ok: boolean
  label: string
}) {
  return (
    <div className="cmp-row">
      <span className={ok ? 'ok' : 'no'}>{ok ? '✓' : '✗'}</span>
      <span>
        {textCh} {ok ? '=' : '≠'} {patternCh}
      </span>
      <span className="lab">{label}</span>
    </div>
  )
}

// ---------- Misc ----------

export function DemoBanner({ text }: { text?: string }) {
  return (
    <span className="demo-banner">
      ⚠ {text ?? 'DADOS DEMONSTRATIVOS — substituir por resultados reais'}
    </span>
  )
}

export function Theta({ children }: { children: ReactNode }) {
  return <span className="theta">Θ({children})</span>
}

/** Envolve conteúdo com animação de entrada (fade-up) atrasada. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'p' | 'span'
  className?: string
}) {
  const style = { ['--d' as string]: `${delay}s` } as CSSProperties
  return (
    <Tag className={'reveal' + (className ? ' ' + className : '')} style={style}>
      {children}
    </Tag>
  )
}