import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SLIDES, type SlideDef } from './slides'

interface DeckCtx {
  slides: SlideDef[]
  slide: SlideDef
  index: number
  total: number
  isFullscreen: boolean
  showOverview: boolean
  next: () => void
  prev: () => void
  goToIndex: (i: number) => void
  goTo: (id: string) => void
  toggleFullscreen: () => void
  setShowOverview: (v: boolean) => void
}

const Ctx = createContext<DeckCtx | null>(null)

export function DeckProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showOverview, setShowOverview] = useState(false)

  const slides = SLIDES
  const total = slides.length
  const slide = slides[Math.min(index, total - 1)]

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, total - 1)),
    [total],
  )
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])
  const goToIndex = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, total - 1))),
    [total],
  )
  const goTo = useCallback(
    (id: string) => {
      const i = slides.findIndex((s) => s.id === id)
      if (i >= 0) setIndex(i)
    },
    [slides],
  )

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'Home':
          e.preventDefault()
          goToIndex(0)
          break
        case 'End':
          e.preventDefault()
          goToIndex(total - 1)
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'o':
        case 'O':
          setShowOverview((v) => !v)
          break
        case 'Escape':
          setShowOverview(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goToIndex, toggleFullscreen, total])

  const value = useMemo<DeckCtx>(
    () => ({
      slides,
      slide,
      index,
      total,
      isFullscreen,
      showOverview,
      next,
      prev,
      goToIndex,
      goTo,
      toggleFullscreen,
      setShowOverview,
    }),
    [
      slides,
      slide,
      index,
      total,
      isFullscreen,
      showOverview,
      next,
      prev,
      goToIndex,
      goTo,
      toggleFullscreen,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDeck(): DeckCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDeck deve ser usado dentro de <DeckProvider>')
  return ctx
}