import { EmpiricalBlock } from './EmpiricalBlock'
import { Reveal, Slide } from '../atoms'

export function KmpEmpiricaSlide() {
  return (
    <Slide
      num="15"
      section="KMP · Análise empírica"
      title="Medindo o KMP"
      subtitle="Os mesmos experimentos da Força Bruta, agora com o comportamento esperado de Θ(n)."
    >
      <div className="slide-body">
        <Reveal delay={0}>
          <EmpiricalBlock focus="kmp" />
        </Reveal>
      </div>
    </Slide>
  )
}