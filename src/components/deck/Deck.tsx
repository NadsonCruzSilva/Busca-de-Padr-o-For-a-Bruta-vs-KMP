import { useEffect, useRef } from 'react'
import { DeckProvider, useDeck } from './DeckProvider'

function FullscreenIcon({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      {full ? (
        <>
          <path d="M4 6h2V4M10 4v2h2M12 10h-2v2M6 12h-2v-2" />
          <rect x="3" y="3" width="10" height="10" rx="1" />
        </>
      ) : (
        <>
          <path d="M4 4h2M4 12h2M12 4h-2M12 12h-2" />
          <rect x="3" y="3" width="10" height="10" rx="1" />
        </>
      )}
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="4" height="4" rx="1" />
      <rect x="9" y="3" width="4" height="4" rx="1" />
      <rect x="3" y="9" width="4" height="4" rx="1" />
      <rect x="9" y="9" width="4" height="4" rx="1" />
    </svg>
  )
}

function Overview() {
  const { slides, index, goToIndex, setShowOverview } = useDeck()
  return (
    <div className="overlay" onClick={() => setShowOverview(false)}>
      <h3>Índice da apresentação</h3>
      <p className="sub">
        Material completo do trabalho, em ordem de apresentação. Clique para ir direto
        à seção.
      </p>
      <div className="ov-grid" onClick={(e) => e.stopPropagation()}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={'ov-card' + (i === index ? ' current' : '')}
            onClick={() => {
              goToIndex(i)
              setShowOverview(false)
            }}
          >
            <span className="n">
              {String(i + 1).padStart(2, '0')} · {s.num}
            </span>
            <span className="t">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function DeckInner() {
  const {
    slides,
    slide,
    index,
    total,
    isFullscreen,
    showOverview,
    next,
    prev,
    goToIndex,
    toggleFullscreen,
    setShowOverview,
  } = useDeck()

  const mainRef = useRef<HTMLElement>(null)

  // Scroll do mouse: rola para o próximo/anterior slide, exceto quando o slide
  // atual é mais alto que a tela e ainda há espaço para rolar dentro dele.
  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    let lastNav = 0
    const onWheel = (e: WheelEvent) => {
      const t = e.target as HTMLElement | null
      if (t) {
        const inControl =
          t.closest('input, textarea, select') || t.isContentEditable
        if (inControl) return
      }
      // scroll predominantemente horizontal (ex.: código com shift+wheel)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      const atTop = el.scrollTop <= 1
      const down = e.deltaY > 0

      if (down && !atBottom) return
      if (!down && !atTop) return

      const now = Date.now()
      if (now - lastNav < 300) {
        e.preventDefault()
        return
      }
      lastNav = now
      e.preventDefault()
      if (down) next()
      else prev()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [next, prev])

  // Ao trocar de slide, garante que o scroll interno comece no topo
  // (o elemento é reutilizado, então o scrollTop anterior vazaria).
  useEffect(() => {
    const el = mainRef.current
    if (el) el.scrollTop = 0
  }, [index])

  return (
    <div className="deck">
      <header className="deck-top">
        <div className="brand">
          <b>TPA · Trabalho 01</b>
          <span className="sep">/</span>
          <span>Busca de Padrão: Força Bruta vs KMP</span>
        </div>
        <div className="top-right">
          <button
            className="icon-btn"
            onClick={() => setShowOverview(true)}
            title="Índice (O)"
            aria-label="Índice"
          >
            <GridIcon />
          </button>
          <button
            className="icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'}
            aria-label="Tela cheia"
          >
            <FullscreenIcon full={isFullscreen} />
          </button>
        </div>
      </header>

      <div className="deck-stage">
        <aside className="deck-rail" aria-label="Progresso da apresentação">
          <span className="rail-section">{slide.section}</span>
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={'rail-dot' + (i === index ? ' current' : '')}
              onClick={() => goToIndex(i)}
              title={s.label}
              aria-label={s.label}
            />
          ))}
        </aside>

        <main ref={mainRef} className="deck-slide">
          {slide.element}
        </main>
      </div>

      <footer className="deck-bottom">
        <div className="bottom-left">
          <span className="counter">
            <span className="cur">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="tot"> / {String(total).padStart(2, '0')}</span>
          </span>
          <span className="muted">·</span>
          <span>{slide.label}</span>
        </div>
        <div className="bottom-right">
          <div className="hints">
            <span>
              <kbd>←</kbd>
              <kbd>→</kbd> navegar
            </span>
            <span>scroll navegar</span>
            <span>
              <kbd>F</kbd> tela cheia
            </span>
            <span>
              <kbd>O</kbd> índice
            </span>
          </div>
          <div className="nav-arrows">
            <button className="nav-btn" onClick={prev} disabled={index === 0} aria-label="Anterior">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </button>
            <button
              className="nav-btn"
              onClick={next}
              disabled={index === total - 1}
              aria-label="Próximo"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {showOverview ? <Overview /> : null}
    </div>
  )
}

export function Deck() {
  return (
    <DeckProvider>
      <DeckInner />
    </DeckProvider>
  )
}