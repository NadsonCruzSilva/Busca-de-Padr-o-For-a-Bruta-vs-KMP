import { createFileRoute } from '@tanstack/react-router'
import { Deck } from '../components/deck/Deck'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <Deck />
}