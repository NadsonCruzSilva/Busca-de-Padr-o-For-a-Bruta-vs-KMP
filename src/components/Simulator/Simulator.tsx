import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  generateTrace,
  calculaLPS,
  MAX_PATTERN_LEN,
  MAX_TEXT_LEN,
} from '../../lib/pattern-search'
import type { Algorithm, SimStep, Trace } from '../../lib/pattern-search'
import { LpsTable } from '../deck/atoms'

const PRESETS: { label: string; text: string; pattern: string }[] = [
  { label: 'ABABABD / ABABD', text: 'ABABABD', pattern: 'ABABD' },
  { label: 'ABABCABAB / ABAB', text: 'ABABCABAB', pattern: 'ABAB' },
  { label: 'AAAAAAAB / AAAB', text: 'AAAAAAAB', pattern: 'AAAB' },
  { label: 'ABABDABAB…/ ABAB', text: 'ABABDABABABDABABABD', pattern: 'ABAB' },
]

const FLOW_STEPS = [
  'Falha',
  'Consultar LPS',
  'Atualizar j = LPS[j − 1]',
  'Continuar sem retroceder i',
]

function flowPhase(step: SimStep, prev: SimStep | undefined): number | null {
  switch (step.event) {
    case 'mismatch':
      return 0
    case 'lps-consult':
      return 1
    case 'j-update':
      return 2
    case 'advance':
      return 3
    case 'compare':
      return prev?.event === 'j-update' || prev?.event === 'advance' ? 3 : null
    default:
      return null
  }
}

/** Anima um número até o valor alvo (contador). */
function useAnimatedNumber(target: number, ms = 300): number {
  const [val, setVal] = useState(target)
  const prevRef = useRef(target)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    if (from === to) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms)
      const eased = 1 - Math.pow(1 - k, 3)
      setVal(Math.round(from + (to - from) * eased))
      if (k < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        prevRef.current = to
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])

  return val
}

function StepTimeline({
  total,
  current,
  onJump,
}: {
  total: number
  current: number
  onJump: (i: number) => void
}) {
  if (total > 200) return null
  return (
    <div className="sim-timeline" role="slider" aria-label="Linha do tempo dos passos">
      {Array.from({ length: total }).map((_, k) => (
        <button
          key={k}
          className={'tl-dot' + (k === current ? ' current' : '')}
          onClick={() => onJump(k)}
          aria-label={`Passo ${k + 1}`}
        />
      ))}
    </div>
  )
}

function TextBoard({
  text,
  pattern,
  step,
}: {
  text: string
  pattern: string
  step: SimStep
}) {
  const n = text.length
  const m = pattern.length
  const cols = Math.max(n, step.offset + m)
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, var(--cell))`,
  }

  const cells: ReactNode[] = []

  // caret row (indica i no texto)
  for (let k = 0; k < cols; k++) {
    cells.push(
      <div
        key={'caret' + k}
        className="cell idx"
        style={{ gridRow: 1, gridColumn: k + 1 }}
      >
        {k === step.i ? '▼' : ''}
      </div>,
    )
  }

  // text row
  for (let k = 0; k < n; k++) {
    let cls = 'cell'
    const isCmp = k === step.i
    if (isCmp && step.result === 'match') cls += ' match'
    if (isCmp && step.result === 'mismatch') cls += ' mismatch'
    if (isCmp) cls += ' active'
    cells.push(
      <div
        key={'t' + k}
        className={cls}
        style={{ gridRow: 2, gridColumn: k + 1 }}
      >
        {text[k]}
      </div>,
    )
  }

  // pattern row
  for (let k = 0; k < m; k++) {
    let cls = 'cell'
    if (k === step.j) cls += ' active'
    if (step.result === 'match' && k === step.j) cls += ' match'
    if (step.result === 'mismatch' && k === step.j) cls += ' mismatch'
    if (step.offset + k >= n) cls += ' dim'
    cells.push(
      <div
        key={'p' + k}
        className={cls}
        style={{ gridRow: 3, gridColumn: step.offset + k + 1 }}
      >
        {pattern[k]}
      </div>,
    )
  }

  return (
    <div className="board" style={gridStyle}>
      {cells}
    </div>
  )
}

export function Simulator({ initialAlgorithm = 'kmp' }: { initialAlgorithm?: Algorithm }) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(initialAlgorithm)
  const [text, setText] = useState('ABABABD')
  const [pattern, setPattern] = useState('ABABD')
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(550)

  const trace: Trace = useMemo(
    () => generateTrace(algorithm, text.toUpperCase(), pattern.toUpperCase()),
    [algorithm, text, pattern],
  )

  useEffect(() => {
    setStepIndex(0)
    setPlaying(false)
  }, [algorithm, text, pattern])

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= trace.steps.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(
      () => setStepIndex((s) => Math.min(s + 1, trace.steps.length - 1)),
      speed,
    )
    return () => clearTimeout(t)
  }, [playing, stepIndex, trace, speed])

  const step = trace.steps[Math.min(stepIndex, trace.steps.length - 1)]
  const prev = trace.steps[stepIndex - 1]
  const phase = flowPhase(step, prev)
  const atEnd = stepIndex >= trace.steps.length - 1
  const animComparisons = useAnimatedNumber(step.comparisons)
  const animTotal = useAnimatedNumber(trace.comparisons)

  const changeText = (v: string) =>
    setText(v.slice(0, MAX_TEXT_LEN).replace(/[^A-Za-z]/g, '').toUpperCase())
  const changePattern = (v: string) =>
    setPattern(v.slice(0, MAX_PATTERN_LEN).replace(/[^A-Za-z]/g, '').toUpperCase())

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setText(p.text)
    setPattern(p.pattern)
  }

  return (
    <div className="sim">
      <div className="sim-controls">
        <div className="seg">
          <button
            className={algorithm === 'brute' ? 'on' : ''}
            onClick={() => setAlgorithm('brute')}
          >
            Força Bruta
          </button>
          <button
            className={algorithm === 'kmp' ? 'on' : ''}
            onClick={() => setAlgorithm('kmp')}
          >
            KMP
          </button>
        </div>

        <button
          className={'ctrl-btn play' + (playing ? ' primary' : '')}
          onClick={() => setPlaying((p) => !p)}
          disabled={atEnd}
          title={playing ? 'Pausar' : 'Executar'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          className="ctrl-btn"
          onClick={() => {
            setPlaying(false)
            setStepIndex((s) => Math.max(0, s - 1))
          }}
          disabled={stepIndex === 0}
          title="Voltar um passo"
        >
          ←
        </button>
        <button
          className="ctrl-btn"
          onClick={() => {
            setPlaying(false)
            setStepIndex((s) => Math.min(trace.steps.length - 1, s + 1))
          }}
          disabled={atEnd}
          title="Avançar um passo"
        >
          →
        </button>
        <button
          className="ctrl-btn"
          onClick={() => {
            setPlaying(false)
            setStepIndex(0)
          }}
          title="Reiniciar"
        >
          ↺
        </button>

        <div className="speed">
          <span>velocidade</span>
          <input
            type="range"
            min={150}
            max={1600}
            step={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span className="faint">{(speed / 1000).toFixed(1)}s</span>
        </div>

        <div className="sim-input">
          <label>texto</label>
          <input value={text} onChange={(e) => changeText(e.target.value)} />
          <label>padrão</label>
          <input value={pattern} onChange={(e) => changePattern(e.target.value)} />
        </div>
      </div>

      <div className="preset-row">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="preset-btn"
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
        <span className="tiny faint" style={{ alignSelf: 'center' }}>
          máx. {MAX_TEXT_LEN} / {MAX_PATTERN_LEN} caracteres
        </span>
      </div>

      <div className="sim-stage">
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="panel">
            <div className="panel-title">Execução passo a passo</div>
            <TextBoard text={trace.text} pattern={trace.pattern} step={step} />
            <div className="sim-status">
              <div className="stat">
                <div className="k">i (texto)</div>
                <div className="v">{step.i}</div>
              </div>
              <div className="stat">
                <div className="k">j (padrão)</div>
                <div className="v">{step.j}</div>
              </div>
              <div className="stat">
                <div className="k">offset</div>
                <div className="v">{step.offset}</div>
              </div>
              <div className="stat">
                <div className="k">comparações</div>
                <div className="v accent">{animComparisons}</div>
              </div>
            </div>

            <div className="sim-note">
              {step.result === 'match' && (
                <>
                  <b>Coincidem:</b> T[{step.i}] = “{step.textChar}” = P[{step.j}] = “
                  {step.patternChar}” ✓
                </>
              )}
              {step.result === 'mismatch' && (
                <>
                  <b>Falha:</b> T[{step.i}] = “{step.textChar}” ≠ P[{step.j}] = “
                  {step.patternChar}” ✗
                </>
              )}
              {!step.result && (
                <>
                  <b>{step.event === 'done' ? 'Fim' : 'Ação'}:</b> {step.note}
                </>
              )}
            </div>

            <div className="board-legend">
              <span>
                <span className="sw" style={{ borderColor: 'var(--match)', background: 'var(--match-soft)' }} />{' '}
                coincidência
              </span>
              <span>
                <span className="sw" style={{ borderColor: 'var(--mismatch)', background: 'var(--mismatch-soft)' }} />{' '}
                falha
              </span>
              <span>
                <span className="sw" style={{ borderColor: 'var(--accent)', background: 'transparent' }} />{' '}
                posição atual
              </span>
              <span>▼ indica i</span>
            </div>

            <StepTimeline
              total={trace.steps.length}
              current={stepIndex}
              onJump={(i) => {
                setPlaying(false)
                setStepIndex(i)
              }}
            />
          </div>

          {algorithm === 'kmp' ? (
            <div className="panel">
              <div className="panel-title">Quando há mismatch no KMP</div>
              <div className="flow">
                {FLOW_STEPS.map((label, k) => (
                  <div key={k}>
                    <div
                      className={
                        'flow-step' + (phase === k ? ' current' : '')
                      }
                    >
                      <span className="ph">{String(k + 1).padStart(2, '0')}</span>
                      <span>{label}</span>
                      {k === 2 && step.lpsValue !== undefined && (
                        <span className="mono faint small" style={{ marginLeft: 'auto' }}>
                          j = {step.newJ}
                        </span>
                      )}
                    </div>
                    {k < FLOW_STEPS.length - 1 && (
                      <div className="flow-arrow">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-title">Quando há mismatch na Força Bruta</div>
              <p className="small muted no-margin">
                <strong style={{ color: 'var(--text)' }}>j</strong> volta a 0 e{' '}
                <strong style={{ color: 'var(--text)' }}>i</strong> retrocede para o
                início do próximo deslocamento (offset + 1). Tudo o que foi comparado é
                descartado e repetido.
              </p>
            </div>
          )}
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          {algorithm === 'kmp' && (
            <div className="panel">
              <div className="panel-title">Tabela LPS do padrão</div>
              <LpsTable
                pattern={trace.pattern}
                lps={trace.lps}
                highlight={step.lpsIndex}
              />
              <p className="small faint mt-1">
                {step.lpsIndex !== undefined && step.lpsValue !== undefined ? (
                  <>
                    Consultando <span className="mono">LPS[{step.lpsIndex}]</span> ={' '}
                    <span className="mono">{step.lpsValue}</span> → novo j ={' '}
                    <span className="mono">{step.newJ ?? step.j}</span>
                  </>
                ) : (
                  'Na falha, o KMP consulta LPS[j − 1] para decidir o novo j.'
                )}
              </p>
            </div>
          )}

          <div className="panel">
            <div className="panel-title">Resumo da execução</div>
            <div className="stat" style={{ marginBottom: '0.5rem' }}>
              <div className="k">comparações totais</div>
              <div className="v accent">{animTotal}</div>
            </div>
            <div className="stat">
              <div className="k">ocorrências</div>
              <div className="v">
                {trace.found.length}
              </div>
            </div>
            <p className="small muted mt-1">
              passo {stepIndex + 1} / {trace.steps.length}
            </p>
            <p className="small faint">
              LPS calculada por:{' '}
              <span className="mono">
                {trace.lps.length > 0 ? trace.lps.join(', ') : '—'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// re-export para uso em ferramentas/testes
export { calculaLPS }