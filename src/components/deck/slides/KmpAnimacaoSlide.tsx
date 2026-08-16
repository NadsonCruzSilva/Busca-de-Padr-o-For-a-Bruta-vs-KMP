import { Slide } from '../atoms'
import { Simulator } from '../../Simulator/Simulator'

export function KmpAnimacaoSlide() {
  return (
    <Slide
      num="13"
      section="KMP · Descrição"
      title="Animações — KMP"
      subtitle="Compare com a Força Bruta: o KMP consulta a LPS e nunca retrocede no texto."
    >
      <Simulator initialAlgorithm="kmp" />
    </Slide>
  )
}