import { useEffect, useMemo, useState } from 'react'
import { CharBoard, CmpRow } from './deck/atoms'

/**
 * Demonstração animada de comparação caractere a caractere entre texto e padrão
 * em um alinhamento fixo. Reproduz passo a passo a verificação de cada posição,
 * destacando coincidências e a primeira falha.
 */
export function CompareDemo({
  text,
  pattern,
  offset = 0,
  initialSpeed = 700,
}: {
  text: string
  pattern: string
  offset?: number
  initialSpeed?: number
}) {
  const m = pattern.length

  const firstMismatch = useMemo(() => {
    for (let k = 0; k < m; k++) {
      if (text[offset + k] !== pattern[k]) return k
    }
    return m
  }, [text, pattern, offset, m])

  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialSpeed)

  const cur = Math.min(pos, firstMismatch)
  const done = pos >= firstMismatch

  useEffect(() => {
    if (!playing) return
    if (done) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setPos((p) => p + 1), speed)
    return () => clearTimeout(t)
  }, [playing, done, speed, pos])

  useEffect(() => {
    setPos(0)
    setPlaying(false)
  }, [text, pattern, offset])

  return (
    <div>
      <CharBoard
        text={text}
        pattern={pattern}
        offset={offset}
        i={offset + cur}
        j={cur}
        marks
        marksUpTo={cur}
        showIndexes
      />

      <div className="cmp-list mt-1">
        {Array.from({ length: Math.min(m, cur + 1) }).map((_, k) => {
          const match = text[offset + k] === pattern[k]
          return (
            <CmpRow
              key={k}
              textCh={text[offset + k]}
              patternCh={pattern[k]}
              ok={match}
              label={k === cur ? (match ? 'atual · coincide' : 'atual · FALHA') : 'verificado'}
            />
          )
        })}
      </div>

      <div className="sim-controls" style={{ marginTop: '0.4rem' }}>
        <button
          className={'ctrl-btn play' + (playing ? ' primary' : '')}
          onClick={() => setPlaying((p) => !p)}
          disabled={done}
          title={playing ? 'Pausar' : 'Executar'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          className="ctrl-btn"
          onClick={() => {
            setPlaying(false)
            setPos((p) => Math.max(0, p - 1))
          }}
          disabled={pos === 0}
          title="Voltar um passo"
        >
          ←
        </button>
        <button
          className="ctrl-btn"
          onClick={() => {
            setPlaying(false)
            setPos((p) => Math.min(m, p + 1))
          }}
          disabled={done}
          title="Avançar um passo"
        >
          →
        </button>
        <button className="ctrl-btn" onClick={() => setPos(0)} title="Reiniciar">
          ↺
        </button>
        <div className="speed">
          <span>velocidade</span>
          <input
            type="range"
            min={200}
            max={1400}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      <p className="small muted" style={{ marginTop: '0.35rem' }}>
        <strong style={{ color: 'var(--text)' }}>
          {cur + 1} comparaç{cur === 0 ? 'ão' : 'ões'}
        </strong>{' '}
        ·{' '}
        {done
          ? firstMismatch < m
            ? `falha em P[${firstMismatch}] = “${pattern[firstMismatch]}” ≠ T[${offset + firstMismatch}] = “${text[offset + firstMismatch]}”.`
            : 'o padrão coincide por completo com o texto neste alinhamento.'
          : 'comparando…'}
      </p>
    </div>
  )
}