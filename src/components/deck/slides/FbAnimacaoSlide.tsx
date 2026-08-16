import { Slide } from '../atoms'
import { Simulator } from '../../Simulator/Simulator'

export function FbAnimacaoSlide() {
  return (
    <Slide
      num="06"
      section="Força Bruta · Descrição"
      title="Animações — Força Bruta"
      subtitle="Experimente: mude o texto, o padrão e acompanhe cada comparação."
    >
      <Simulator initialAlgorithm="brute" />
    </Slide>
  )
}