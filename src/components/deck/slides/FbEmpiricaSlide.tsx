import { EmpiricalBlock } from './EmpiricalBlock'
import { Reveal, Slide } from '../atoms'

export function FbEmpiricaSlide() {
  return (
    <Slide
      num="08"
      section="Força Bruta · Análise empírica"
      title="Medindo a Força Bruta"
      subtitle="Metodologia, conjuntos de teste e comparação com a previsão teórica."
    >
      <div className="slide-body">
        <Reveal delay={0}>
          <EmpiricalBlock focus="brute" />
        </Reveal>
      </div>
    </Slide>
  )
}