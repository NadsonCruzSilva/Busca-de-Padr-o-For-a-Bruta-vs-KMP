import { useMemo, useState } from 'react'
import { LpsTable, Panel, Slide } from '../atoms'
import { calculaLPS } from '../../../lib/pattern-search'

const EXPLORE_PATTERNS = ['ABABC', 'AAAA', 'ABCABABC', 'ABABD', 'AABAACAABAA']

function PrefixSuffixDemo({
  chars,
  split,
  result,
  activeLength,
}: {
  chars: string[]
  split: number
  result: string
  activeLength?: number
}) {
  const m = activeLength ?? chars.length
  return (
    <div>
      <div className="prefix-demo">
        {chars.map((ch, k) => (
          <span
            key={k}
            className={'pfx ' + (k < split ? 'p' : k >= m - split && k < m ? 's' : '')}
            style={{ opacity: k < m ? 1 : 0.25 }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className="small muted mt-1">
        prefixo <span className="mono" style={{ color: 'var(--accent)' }}>“{chars.slice(0, split).join('')}”</span>
        {' '}· sufixo{' '}
        <span className="mono" style={{ color: 'var(--match)' }}>“{chars.slice(m - split, m).join('')}”</span>
        {' '}→ <strong>{result}</strong>
      </div>
    </div>
  )
}

/** Explorador interativo: escolha um padrão e veja cada LPS calculada. */
function LpsExplorer() {
  const [pattern, setPattern] = useState('ABABC')
  const [k, setK] = useState(4)

  const lps = useMemo(() => calculaLPS(pattern), [pattern])
  const chars = pattern.split('')
  const length = Math.max(0, Math.min(k, pattern.length))
  const split = k > 0 ? lps[length - 1] : 0

  return (
    <div>
      <div className="preset-row">
        {EXPLORE_PATTERNS.map((p) => (
          <button
            key={p}
            className={'preset-btn' + (p === pattern ? ' on' : '')}
            onClick={() => {
              setPattern(p)
              setK(p.length)
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <LpsTable
        pattern={pattern}
        lps={lps}
        highlight={length - 1}
        className="mt-1"
      />

      <div className="sim-input mt-1">
        <label>prefixo até {length} caractere{length === 1 ? '' : 's'}</label>
        <input
          type="range"
          min={0}
          max={pattern.length}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </div>

      {length > 0 ? (
        <PrefixSuffixDemo
          chars={chars}
          split={split}
          activeLength={length}
          result={`LPS[${length - 1}] = ${split}`}
        />
      ) : (
        <p className="small muted">Arraste o controle para percorrer os prefixos.</p>
      )}
    </div>
  )
}

export function LpsSlide() {
  return (
    <Slide
      num="11"
      section="KMP · Descrição"
      title="Tabela LPS"
      subtitle="Longest Proper Prefix which is also Suffix — o que o KMP precomputa no padrão."
    >
      <div className="grid grid-2-1">
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Definição">
            <p className="lead no-margin">
              Para cada prefixo do padrão, LPS guarda o tamanho do{' '}
              <strong>maior prefixo próprio que também é sufixo</strong>. É o que permite
              realinhar o padrão <strong>sem recomeçar do zero</strong>.
            </p>
          </Panel>

          <Panel title="Explorador interativo">
            <LpsExplorer />
          </Panel>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Exemplo — ABAB → LPS = 2">
            <PrefixSuffixDemo chars={['A', 'B', 'A', 'B']} split={2} result="LPS = 2" />
          </Panel>

          <Panel title="Sentido prático">
            <ul className="clean">
              <li>Evita comparar de novo o que já foi verificado.</li>
              <li>
                No exemplo ABABABD/ABABD, a falha em <strong>j = 4</strong> usa{' '}
                <strong>LPS[3] = 2</strong>: dois caracteres continuam aproveitados.
              </li>
              <li>
                O <strong>texto</strong> é percorrido de frente, sem retroceder.
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}