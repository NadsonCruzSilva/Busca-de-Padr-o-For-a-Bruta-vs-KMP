import { CodeBlock } from '../../CodeBlock'
import { Panel, Slide } from '../atoms'
import { javaBruteCode } from '../../../lib/javaCode'

const LINE_NOTES = [
  { lines: '5', hl: [5], text: 'Laço externo: percorre todos os n − m + 1 deslocamentos.' },
  { lines: '9–10', hl: [9, 10], text: 'Laço interno: compara o padrão inteiro (j = 0 … m−1).' },
  { lines: '13', hl: [13], text: 'Se j chegou a m, todas as comparações coincidiram → ocorrência em i.' },
  { lines: '15–16', hl: [15, 16], text: 'Falha: fecha o deslocamento e vai para o próximo (i + 1).' },
  { lines: '19', hl: [19], text: 'Nenhum deslocamento coincidiu → padrão não encontrado.' },
]

const ALL_HL = LINE_NOTES.flatMap((n) => n.hl)

export function FbCodigoSlide() {
  return (
    <Slide
      num="05"
      section="Força Bruta · Descrição"
      title="O código da Força Bruta"
      subtitle="Um laço aninhado: deslocamentos × caracteres do padrão."
      className="slide-wide"
    >
      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start', gap: '1.25rem' }}>
        <CodeBlock title="buscaForcaBruta" code={javaBruteCode} highlightLines={ALL_HL} />
        <div className="grid" style={{ alignContent: 'start' }}>
          <Panel title="Linha a linha">
            <ol className="line-notes">
              {LINE_NOTES.map((n) => (
                <li key={n.lines}>
                  <span className="mono dim">{n.lines}</span>
                  <span>{n.text}</span>
                </li>
              ))}
            </ol>
          </Panel>
          <div className="note">
            Sem pré-processamento e com espaço auxiliar <strong>O(1)</strong>: as únicas
            variáveis são os índices i e j.
          </div>
        </div>
      </div>
    </Slide>
  )
}