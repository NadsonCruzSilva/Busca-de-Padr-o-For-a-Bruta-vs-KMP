import { CharBoard, Panel, Slide, Theta } from '../atoms'

export function IntroducaoSlide() {
  return (
    <Slide
      num="03"
      section="Introdução"
      title="O problema da busca de padrão"
      subtitle="Localizar todas as ocorrências de um padrão P dentro de um texto T."
    >
      <div className="grid grid-2-1">
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Definição do problema">
            <p className="lead no-margin">
              Dado um <strong>texto T</strong> de tamanho <strong>n</strong> e um{' '}
              <strong>padrão P</strong> de tamanho <strong>m</strong>, o objetivo é
              encontrar ocorrências de <strong>P</strong> em <strong>T</strong>.
            </p>
          </Panel>

          <Panel title="Exemplo visual">
            <CharBoard
              text="ABABCABAB"
              pattern="ABAB"
              offset={0}
              marks
              showIndexes
            />
            <p className="small muted mt-1">
              Padrão ABAB comparado ao texto ABABCABAB: coincidem nas posições 0–3 e 5–8.
            </p>
          </Panel>

          <Panel title="Aplicações">
            <div className="badge-row">
              <span className="tag">editores de texto</span>
              <span className="tag">ferramentas de busca</span>
              <span className="tag hl">grep</span>
              <span className="tag">bioinformática</span>
              <span className="tag">antivírus</span>
            </div>
          </Panel>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Duas estratégias">
            <ul className="clean">
              <li>
                <strong>Força Bruta</strong> — desloca o padrão uma posição por vez e
                compara do início a cada tentativa. Simples, sem pré-processamento.
              </li>
              <li>
                <strong>KMP</strong> — pré-processa o padrão (tabela LPS) e, após uma
                falha, reutiliza as comparações já feitas. Não retrocede no texto.
              </li>
            </ul>
          </Panel>

          <Panel title="Quadro comparativo">
            <table className="data">
              <thead>
                <tr>
                  <th>Algoritmo</th>
                  <th>Melhor caso</th>
                  <th>Caso médio</th>
                  <th>Pior caso</th>
                  <th>Espaço</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Força Bruta</td>
                  <td>
                    <Theta>n</Theta>
                  </td>
                  <td>
                    ≈ <Theta>n</Theta>*
                  </td>
                  <td>
                    <Theta>nm</Theta>
                  </td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>KMP</td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                  <td>
                    <Theta>n + m</Theta>
                  </td>
                  <td>O(m)</td>
                </tr>
              </tbody>
            </table>
            <p className="small faint mt-1">
              * O comportamento médio da Força Bruta depende da distribuição das entradas
              (alfabeto, texto natural etc.) — não é uma garantia universal.
            </p>
          </Panel>

          <div className="note">
            A diferença prática entre os dois algoritmos só aparece quando a busca exige
            revisitar posições já comparadas. É exatamente esse o ponto atacado pelo KMP.
          </div>
        </div>
      </div>
    </Slide>
  )
}