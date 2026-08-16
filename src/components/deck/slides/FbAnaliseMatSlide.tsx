import { Panel, Slide, Theta } from '../atoms'

const ROWS = [
  { op: 'deslocamento i = 0 … n−m', custo: '1 operação básica', vezes: 'n − m + 1' },
  { op: 'comparação T[i+j] ≠ P[j]', custo: '1 comparação', vezes: 'n − m + 1 × (j até m)' },
  { op: 'ocorrência: retorna i', custo: '1', vezes: 'no máximo 1' },
]

export function FbAnaliseMatSlide() {
  return (
    <Slide
      num="08"
      section="Força Bruta · Análise matemática"
      title="Análise de complexidade da Força Bruta"
      subtitle="O custo exato depende de quantas posições do padrão são comparadas por deslocamento."
    >
      <div className="grid grid-2">
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Custo por operação">
            <table className="data">
              <thead>
                <tr>
                  <th>operação</th>
                  <th>custo</th>
                  <th>vezes</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.op}>
                    <td>{r.op}</td>
                    <td className="mono">{r.custo}</td>
                    <td className="mono">{r.vezes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="O somatório que domina">
            <p className="small muted no-margin">
              Contando só as comparações de caracteres, para cada deslocamento{' '}
              <strong>i</strong> fazemos t<sub>i</sub> comparações (t<sub>i</sub> ∈ [1, m]):
            </p>
            <div className="math">
              C(n, m) = Σ<sub>i=0</sub><sup>n−m</sup> t<sub>i</sub>
            </div>
            <p className="small muted mt-1">
              É o valor de t<sub>i</sub> que separa os casos:
            </p>
            <table className="data mt-1">
              <tbody>
                <tr>
                  <td>melhor: sempre t<sub>i</sub> = 1</td>
                  <td>
                    <Theta>n − m + 1</Theta> → <Theta>n</Theta>
                  </td>
                </tr>
                <tr>
                  <td>pior: sempre t<sub>i</sub> = m</td>
                  <td>
                    <Theta>(n − m + 1)·m</Theta> → <Theta>nm</Theta>
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="O pior caso na prática">
            <p className="small muted no-margin">
              T = aaaaaaaaaa… e P = aaaa…ab. Para cada deslocamento, o laço interno
              percorre <strong>m − 1</strong> coincidências antes de falhar no último
              caractere:
            </p>
            <div className="math">
              C(n, m) ≈ (n − m + 1) · m <span className="mono">→</span> <Theta>n·m</Theta>
            </div>
            <p className="small faint mt-1">
              <span className="mono">n = 1 000 000</span>,{' '}
              <span className="mono">m = 1000</span> → ≈ 10⁹ comparações: o custo fica
              quadrático mesmo com n grande.
            </p>
          </Panel>

          <Panel title="Resumo (notação assintótica)">
            <table className="data">
              <tbody>
                <tr>
                  <td>Melhor caso</td>
                  <td>
                    <strong>Ω(n)</strong> · <Theta>n</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Caso médio (texto aleatório)</td>
                  <td>
                    <strong><Theta>n</Theta></strong> — a falha costuma ocorrer na 1ª comparação
                  </td>
                </tr>
                <tr>
                  <td>Pior caso</td>
                  <td>
                    <strong>O(nm)</strong> · <Theta>nm</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Espaço auxiliar</td>
                  <td>O(1)</td>
                </tr>
              </tbody>
            </table>
            <p className="small faint mt-1">
              Ω descreve o <strong>limite inferior</strong> (melhor caso), O o{' '}
              <strong>limite superior</strong> (pior caso) e Θ o comportamento exato.
              Como Ω(n) ≠ <Theta>nm</Theta>, o algoritmo não tem um Θ único para todas as entradas.
            </p>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}