import { Panel, Slide, Theta } from '../atoms'

const KMP_SEARCH_ROWS = [
  { op: 'comparações no laço da busca', custo: '1', vezes: 'O(n) no total (amortizado)' },
  { op: 'ajustes de j via LPS (falhas)', custo: '1 por ajuste', vezes: 'O(n) no total' },
  { op: 'cada caractere do texto comparado', custo: '1', vezes: '≤ n avanços de i' },
]

const LPS_ROWS = [
  { op: 'comparações em calculaLPS', custo: '1', vezes: '≤ 2m' },
  { op: 'ajustes de j na construção', custo: '1', vezes: 'O(m)' },
]

export function AnaliseMatSlide() {
  return (
    <Slide
      num="16"
      section="KMP · Análise matemática"
      title="Análise de complexidade do KMP"
      subtitle="O padrão é pré-processado uma vez; o texto é percorrido sem retroceder."
    >
      <div className="grid grid-2">
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Custo por operação — busca">
            <table className="data">
              <thead>
                <tr>
                  <th>operação</th>
                  <th>custo</th>
                  <th>vezes</th>
                </tr>
              </thead>
              <tbody>
                {KMP_SEARCH_ROWS.map((r) => (
                  <tr key={r.op}>
                    <td>{r.op}</td>
                    <td className="mono">{r.custo}</td>
                    <td className="mono">{r.vezes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Custo por operação — construindo a LPS">
            <table className="data">
              <thead>
                <tr>
                  <th>operação</th>
                  <th>custo</th>
                  <th>vezes</th>
                </tr>
              </thead>
              <tbody>
                {LPS_ROWS.map((r) => (
                  <tr key={r.op}>
                    <td>{r.op}</td>
                    <td className="mono">{r.custo}</td>
                    <td className="mono">{r.vezes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="O argumento amortizado da busca">
            <p className="small muted no-margin">
              <strong>i</strong> avança em todas as coincidências e só cresce. Cada falha
              reduz <strong>j</strong> (via LPS), e um caractere do texto pode ser
              re-compareado no máximo uma vez por nível de j. Somando os custos:
            </p>
            <div className="math">
              C(n) ≤ n (avanços de i) + n (ajustes de j) → O(n)
            </div>
            <p className="small faint mt-1">
              Logo o total é <Theta>n</Theta> e, somando o pré-processamento,{' '}
              <Theta>n + m</Theta>.
            </p>
          </Panel>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Notação assintótica">
            <table className="data">
              <tbody>
                <tr>
                  <td>Melhor caso</td>
                  <td>
                    <strong>Ω(n + m)</strong>
                  </td>
                </tr>
                <tr>
                  <td>Caso médio</td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Pior caso</td>
                  <td>
                    <strong>O(n + m)</strong> · <Theta>n + m</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Espaço auxiliar</td>
                  <td>O(m) — a tabela LPS</td>
                </tr>
              </tbody>
            </table>
            <p className="small faint mt-1">
              Diferente da Força Bruta, o KMP tem um <strong><Theta>n + m</Theta></strong> válido
              para toda entrada: não existe caso em que ele degenera.
            </p>
          </Panel>

          <Panel title="Comparação com a Força Bruta">
            <table className="data">
              <thead>
                <tr>
                  <th>Caso</th>
                  <th>Força Bruta</th>
                  <th>KMP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Melhor</td>
                  <td>
                    <Theta>n</Theta>
                  </td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Médio*</td>
                  <td>≈ <Theta>n</Theta></td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Pior</td>
                  <td>
                    <Theta>nm</Theta>
                  </td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="small faint mt-1">
              * Médio da Força Bruta depende da distribuição das entradas.
            </p>
          </Panel>

          <div className="note">
            O ganho aparece exatamente nos casos em que a Força Bruta sofre: texto e
            padrão repetitivos, onde ela chega a <Theta>nm</Theta> e o KMP permanece{' '}
            <Theta>n + m</Theta>.
          </div>
        </div>
      </div>
    </Slide>
  )
}