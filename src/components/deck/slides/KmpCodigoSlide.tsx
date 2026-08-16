import { CodeBlock } from '../../CodeBlock'
import { Panel, Slide } from '../atoms'
import { javaKmpCode, javaLpsCode } from '../../../lib/javaCode'

const LPS_NOTES = [
  { lines: '12–15', hl: [12, 13, 14, 15], text: 'Coincidência: o prefixo cresce e LPS[i] = len + 1.' },
  { lines: '16–17', hl: [16, 17], text: 'Falha: len retrocede para LPS[len − 1].' },
  { lines: '18–20', hl: [18, 19, 20], text: 'Sem reuso possível: LPS[i] = 0 e avança.' },
  { lines: '25', hl: [25], text: 'Devolve a tabela — custo O(m) no total.' },
]

const KMP_NOTES = [
  { lines: '4', hl: [4], text: 'Pré-processamento: LPS calculada uma única vez.' },
  { lines: '10–13', hl: [10, 11, 12, 13], text: 'Coincidência: avança os dois ponteiros (i e j).' },
  { lines: '16–17', hl: [16, 17], text: 'j = m → ocorrência encontrada em i − m.' },
  { lines: '20–22', hl: [20, 21, 22], text: 'Falha com j > 0: reutiliza o prefixo — j = LPS[j − 1].' },
  { lines: '23–24', hl: [23, 24], text: 'Falha com j = 0: nada a reaproveitar; segue no texto.' },
]

export function KmpCodigoSlide() {
  return (
    <Slide
      num="12"
      section="KMP · Descrição"
      title="O código do KMP"
      subtitle="Duas fases: pré-processamento (LPS) e busca com i nunca retrocedendo."
      className="slide-wide"
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: '2.1fr 1fr 2.1fr 1fr', alignItems: 'start', gap: '1rem' }}
      >
        <CodeBlock
          title="calculaLPS"
          code={javaLpsCode}
          highlightLines={LPS_NOTES.flatMap((n) => n.hl)}
          compact
        />
        <Panel title="Linha a linha — calculaLPS">
          <ol className="line-notes">
            {LPS_NOTES.map((n) => (
              <li key={n.lines}>
                <span className="mono dim">{n.lines}</span>
                <span>{n.text}</span>
              </li>
            ))}
          </ol>
        </Panel>
        <CodeBlock
          title="buscaKMP"
          code={javaKmpCode}
          highlightLines={KMP_NOTES.flatMap((n) => n.hl)}
          compact
        />
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Linha a linha — buscaKMP">
            <ol className="line-notes">
              {KMP_NOTES.map((n) => (
                <li key={n.lines}>
                  <span className="mono dim">{n.lines}</span>
                  <span>{n.text}</span>
                </li>
              ))}
            </ol>
          </Panel>
          <div className="note good">
            O segredo está na linha <span className="mono">j = lps[j − 1]</span>: o
            avanço acumulado que coincide com um prefixo nunca é re-comparado.
          </div>
        </div>
      </div>
    </Slide>
  )
}