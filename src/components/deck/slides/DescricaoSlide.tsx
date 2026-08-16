import { CharBoard, Panel, Slide, Theta } from '../atoms'
import { CompareDemo } from '../../CompareDemo'

// ---------------- Força Bruta ----------------

export function ForcaBrutaSlide() {
  return (
    <Slide
      num="04"
      section="Força Bruta · Descrição"
      title="Força Bruta"
      subtitle="A estratégia mais direta: tentar todos os deslocamentos possíveis."
    >
      <div className="grid grid-2">
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Funcionamento">
            <ul className="clean">
              <li>
                Para cada <strong>deslocamento i</strong> de 0 a <strong>n − m</strong>,
                compara <strong>T[i+j]</strong> com <strong>P[j]</strong>, j = 0, 1, …, m−1.
              </li>
              <li>
                Ao encontrar uma falha, <strong>j volta a 0</strong> e o padrão desloca
                uma posição à frente.
              </li>
              <li>Quando todos os m caracteres coincidem, temos uma ocorrência em i.</li>
            </ul>
          </Panel>

          <Panel title="Execução passo a passo — T = ABABABD, P = ABABD">
            <CompareDemo text="ABABABD" pattern="ABABD" offset={0} />
          </Panel>

          <div className="note">
            No primeiro alinhamento, as posições 0–3 coincidem e a falha ocorre em{' '}
            <strong>T[4] = A ≠ D</strong> — a Força Bruta recomeça do offset 1.
          </div>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="O ponto fraco: comparações repetidas">
            <p className="small muted no-margin">
              Considere T = <span className="mono">ABABABD</span> e P ={' '}
              <span className="mono">ABABD</span>.
            </p>
            <CharBoard text="ABABABD" pattern="ABABD" offset={0} marks showIndexes className="mt-1" />
            <p className="small muted">
              Após a falha em T[4] = A ≠ D, os prefixos <strong>ABAB</strong> já
              comparados são descartados — e as mesmas posições serão comparadas de
              novo nos deslocamentos seguintes.
            </p>
          </Panel>

          <Panel title="Complexidade">
            <table className="data">
              <tbody>
                <tr>
                  <td>Melhor caso (primeiro caractere sempre difere)</td>
                  <td>
                    <Theta>n</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Caso médio (textos naturais/aleatórios)</td>
                  <td>≈ <Theta>n</Theta>, depende das entradas</td>
                </tr>
                <tr>
                  <td>Pior caso (texto e padrão repetitivos)</td>
                  <td>
                    <Theta>nm</Theta>
                  </td>
                </tr>
                <tr>
                  <td>Espaço auxiliar</td>
                  <td>O(1)</td>
                </tr>
              </tbody>
            </table>
            <p className="small faint mt-1">
              Pior caso: T = aaaaa…a e P = aaa…ab. Cada deslocamento percorre quase o
              padrão inteiro antes de falhar no último caractere.
            </p>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

// ---------------- KMP: ideia central ----------------

export function KmpIdeiaSlide() {
  return (
    <Slide
      num="09"
      section="KMP · Descrição"
      title="KMP — Knuth-Morris-Pratt"
      subtitle="Apresentado por Nadson. Pré-processa o padrão e reutiliza as comparações já feitas."
    >
      <div className="grid grid-2-1">
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="central-phrase">
            “O KMP utiliza informações obtidas durante a comparação para{' '}
            <strong>evitar comparações desnecessárias</strong>.”
          </div>

          <Panel title="Execução passo a passo — T = ABABABD, P = ABABD">
            <CompareDemo text="ABABABD" pattern="ABABD" offset={0} />
          </Panel>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Após a falha…">
            <p className="small muted">
              A Força Bruta simplesmente recomeça no deslocamento seguinte. O KMP não:
              ele sabe que o prefixo <strong>ABAB</strong> já foi verificado e usa essa
              informação para não repetir comparações.
            </p>
            <div className="flow">
              <div className="flow-step current">
                <span className="ph">Falha</span>
                <span>T[4] = A ≠ P[4] = D</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">
                <span className="ph">Consultar LPS</span>
                <span>LPS[3] = 2</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">
                <span className="ph">Ajustar j</span>
                <span>j = LPS[j − 1] = 2</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">
                <span className="ph">Continuar</span>
                <span>i não retrocede no texto</span>
              </div>
            </div>
          </Panel>

          <div className="note">
            O <strong>pré-processamento</strong> do padrão (tabela LPS) é o coração do
            KMP: custa <Theta>m</Theta> e acontece uma única vez.
          </div>
        </div>
      </div>
    </Slide>
  )
}

// ---------------- O problema das comparações repetidas ----------------

export function RepetidasSlide() {
  return (
    <Slide
      num="10"
      section="KMP · Descrição"
      title="Por que comparar tudo de novo?"
      subtitle="O custo da Força Bruta está em re-comparar o que já foi verificado."
    >
      <div className="grid grid-2">
        <Panel title="Força Bruta — i retrocede">
          <CharBoard
            text="ABABABD"
            pattern="ABABD"
            offset={0}
            i={4}
            j={4}
            marks
            showIndexes
          />
          <p className="small muted mt-1">
            Falha em T[4]. A Força Bruta <strong>descarta</strong> as quatro coincidências
            e reinicia <strong>j = 0</strong> no offset 1:
          </p>
          <CharBoard
            text="ABABABD"
            pattern="ABABD"
            offset={1}
            marks
            showIndexes
            className="mt-1"
          />
          <p className="small faint">
            As posições 1–3 (ABA) são comparadas <strong>novamente</strong>.
          </p>
        </Panel>

        <Panel title="KMP — reutiliza o prefixo">
          <CharBoard
            text="ABABABD"
            pattern="ABABD"
            offset={0}
            i={4}
            j={4}
            marks
            showIndexes
          />
          <p className="small muted mt-1">
            O prefixo <strong>ABAB</strong> tem LPS = 2 (o sufixo <strong>AB</strong> é
            também prefixo). Então <strong>j = LPS[3] = 2</strong>:
          </p>
          <CharBoard
            text="ABABABD"
            pattern="ABABD"
            offset={2}
            i={4}
            j={2}
            marks
            showIndexes
            className="mt-1"
          />
          <p className="small faint">
            O texto <strong>não retrocede</strong> (i continua em 4). O padrão é
            realinhado e as comparações continuam de onde a informação útil terminou.
          </p>
        </Panel>
      </div>

      <div className="central-phrase mt-2">
        “O KMP não precisa repetir comparações que podem ser evitadas usando a informação
        da <strong>LPS</strong>.”
      </div>
    </Slide>
  )
}