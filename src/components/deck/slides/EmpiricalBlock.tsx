import { useMemo, useState } from 'react'
import { Chart } from '../../Chart'
import { benchmarkSets, isDemoData, demoNotice } from '../../../data/benchmarks'
import type { BenchSet } from '../../../data/benchmarks'
import { DemoBanner, Panel } from '../atoms'

type Metric = 'comparisons' | 'time'
type Scale = 'normal' | 'loglog'

/** Metodologia + conjuntos de teste + gráficos/tabela, com destaque para um algoritmo. */
export function EmpiricalBlock({ focus }: { focus: 'brute' | 'kmp' }) {
  const [setId, setSetId] = useState<BenchSet['id']>('adversario')
  const [metric, setMetric] = useState<Metric>('comparisons')
  const [scale, setScale] = useState<Scale>('normal')

  const set = benchmarkSets.find((s) => s.id === setId) ?? benchmarkSets[0]

  const series = useMemo(() => {
    return [
      {
        label: 'Força Bruta',
        points: set.points.map((p) => ({
          x: p.n,
          y: metric === 'comparisons' ? p.brute.comparisons : p.brute.timeMs,
        })),
        dashed: false,
        highlight: focus === 'brute',
      },
      {
        label: 'KMP',
        points: set.points.map((p) => ({
          x: p.n,
          y: metric === 'comparisons' ? p.kmp.comparisons : p.kmp.timeMs,
        })),
        dashed: false,
        highlight: focus === 'kmp',
      },
    ]
  }, [set, metric, focus])

  const xLog = scale === 'loglog'
  const yLog = scale === 'loglog'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: '1 1 auto', minHeight: 0 }}>
      <div className="grid grid-3" style={{ flexShrink: 0 }}>
        <Panel title="Metodologia">
          <ul className="clean">
            <li>Java (OpenJDK), sem flags de otimização.</li>
            <li>Tempos com <span className="mono">System.nanoTime()</span> e aquecimento.</li>
            <li>Média de várias execuções (maior e menor descartados).</li>
            <li>Semente fixa + contadores de comparações instrumentados.</li>
          </ul>
        </Panel>

        <Panel title="Conjuntos de teste">
          {benchmarkSets.map((s) => (
            <button
              key={s.id}
              className={'preset-btn' + (s.id === setId ? ' on' : '')}
              style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '0.25rem' }}
              onClick={() => setSetId(s.id)}
            >
              <strong>{s.label}</strong>
              <br />
              <span className="tiny faint">{s.description}</span>
            </button>
          ))}
        </Panel>

        <Panel title="Controles dos gráficos">
          <div className="badge-row" style={{ marginBottom: '0.35rem' }}>
            <div className="seg">
              <button className={metric === 'comparisons' ? 'on' : ''} onClick={() => setMetric('comparisons')}>
                comparações
              </button>
              <button className={metric === 'time' ? 'on' : ''} onClick={() => setMetric('time')}>
                tempo
              </button>
            </div>
            <div className="seg">
              <button className={scale === 'normal' ? 'on' : ''} onClick={() => setScale('normal')}>
                normal
              </button>
              <button className={scale === 'loglog' ? 'on' : ''} onClick={() => setScale('loglog')}>
                log-log
              </button>
            </div>
          </div>
          <div className="small muted">
            {set.label}: {set.patternNote}.{' '}
            {metric === 'time' ? 'Tempo médio em ms (demonstrativo).' : 'Número de comparações.'}
          </div>
          {isDemoData && (
            <p className="tiny faint mt-1 no-margin">
              <DemoBanner text={demoNotice} />
            </p>
          )}
        </Panel>
      </div>

      <div className="grid grid-2-1" style={{ flex: '1 1 0', minHeight: 0 }}>
        <Panel title={`${metric === 'time' ? 'Tempo' : 'Comparações'} × n — ${set.label}`}>
          <Chart
            series={series}
            xLog={xLog}
            yLog={yLog}
            xLabel="tamanho do texto (n)"
            yLabel={metric === 'time' ? 'tempo (ms)' : 'comparações'}
          />
        </Panel>

        <Panel title="Tabela (dados demonstrativos)">
          <div style={{ overflowX: 'auto' }}>
            <table className="data">
              <thead>
                <tr>
                  <th>n</th>
                  <th>m</th>
                  <th>FB comp.</th>
                  <th>FB ms</th>
                  <th>KMP comp.</th>
                  <th>KMP ms</th>
                </tr>
              </thead>
              <tbody>
                {set.points.map((p) => (
                  <tr key={p.n}>
                    <td className="mono">{p.n.toLocaleString('pt-BR')}</td>
                    <td className="mono">{p.m}</td>
                    <td className={'mono' + (focus === 'brute' ? ' hl' : '')}>
                      {p.brute.comparisons.toExponential(1)}
                    </td>
                    <td className={'mono' + (focus === 'brute' ? ' hl' : '')}>
                      {p.brute.timeMs.toExponential(1)}
                    </td>
                    <td className={'mono' + (focus === 'kmp' ? ' hl' : '')}>
                      {p.kmp.comparisons.toExponential(1)}
                    </td>
                    <td className={'mono' + (focus === 'kmp' ? ' hl' : '')}>
                      {p.kmp.timeMs.toExponential(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny faint mt-1">
            Valores em <span className="mono">src/data/benchmarks.ts</span> — atualização automática.
          </p>
        </Panel>
      </div>
    </div>
  )
}