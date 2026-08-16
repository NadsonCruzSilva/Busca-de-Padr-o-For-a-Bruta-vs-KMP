import { useMemo } from 'react'

export interface SeriesPoint {
  x: number
  y: number
}

export interface ChartSeries {
  label: string
  points: SeriesPoint[]
  color?: string
  dashed?: boolean
  /** quando definido, esta série é destacada e as demais ficam atenuadas */
  highlight?: boolean
}

interface ChartProps {
  series: ChartSeries[]
  xLog?: boolean
  yLog?: boolean
  xLabel: string
  yLabel: string
}

const W = 680
const H = 135
const M = { top: 8, right: 10, bottom: 30, left: 42 }

const ACCENT = 'var(--accent)'
const NEUTRAL = 'var(--dim)'

function niceTicks(min: number, max: number, count: number): number[] {
  if (min === max) max = min + 1
  const span = max - min
  const step = Math.pow(10, Math.floor(Math.log10(span / count)))
  const err = (span / count) / step
  let niceStep =
    err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1
  niceStep *= step
  const start = Math.ceil(min / niceStep) * niceStep
  const ticks: number[] = []
  for (let v = start; v <= max; v += niceStep) {
    ticks.push(Number(v.toPrecision(8)))
    if (ticks.length > 24) break
  }
  return ticks
}

function logTicks(logMin: number, logMax: number): number[] {
  // domain.xMin/xMax are already in log10 scale when xLog=true
  // so logMin = log10(realMin), logMax = log10(realMax)
  // we need ticks at integer powers of 10 within [logMin, logMax]
  const lo = Math.floor(logMin)
  const hi = Math.ceil(logMax)
  if (!isFinite(lo) || !isFinite(hi) || hi - lo > 20) return []
  const ticks: number[] = []
  for (let k = lo; k <= hi; k++) {
    const realVal = Math.pow(10, k)
    ticks.push(realVal)
  }
  return ticks
}

function fmt(v: number): string {
  if (v >= 1e12) return v.toExponential(1).replace('e+', 'e')
  if (v >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, '') + 'e9'
  if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1e4) return (v / 1e3).toFixed(0) + 'k'
  if (v >= 1000) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  if (v >= 100) return v.toFixed(0)
  return Number.isInteger(v) ? String(v) : v.toFixed(2)
}

function lg(v: number): number {
  return Math.log10(v)
}

export function Chart({ series, xLog = false, yLog = false, xLabel, yLabel }: ChartProps) {
  const { innerW, innerH, domain } = useMemo(() => {
    const innerW = W - M.left - M.right
    const innerH = H - M.top - M.bottom
    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity
    for (const s of series) {
      for (const p of s.points) {
        const x = xLog ? lg(p.x) : p.x
        const y = yLog ? lg(p.y) : p.y
        if (x < xMin) xMin = x
        if (x > xMax) xMax = x
        if (y < yMin) yMin = y
        if (y > yMax) yMax = y
      }
    }
    if (!isFinite(xMin)) {
      xMin = 0
      xMax = 1
      yMin = 0
      yMax = 1
    }
    const xPad = xLog ? 0.05 : (xMax - xMin) * 0.04
    const yPad = yLog ? 0.08 : (yMax - yMin) * 0.05
    return {
      innerW,
      innerH,
      domain: {
        xMin: xMin - xPad,
        xMax: xMax + xPad,
        yMin: Math.max(0, yMin - yPad),
        yMax: yMax + yPad,
      },
    }
  }, [series, xLog, yLog])

  const sx = (v: number) => M.left + ((xLog ? lg(v) : v) - domain.xMin) * (innerW / (domain.xMax - domain.xMin))
  const sy = (v: number) => M.top + innerH - ((yLog ? lg(v) : v) - domain.yMin) * (innerH / (domain.yMax - domain.yMin))

  const xTicks = useMemo(
    () => (xLog ? logTicks(domain.xMin, domain.xMax) : niceTicks(domain.xMin, domain.xMax, 6)),
    [xLog, domain.xMin, domain.xMax],
  )
  const yTicks = useMemo(
    () => (yLog ? logTicks(domain.yMin, domain.yMax) : niceTicks(domain.yMin, domain.yMax, 6)),
    [yLog, domain.yMin, domain.yMax],
  )

  const hasHighlight = series.some((s) => s.highlight)

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${yLabel} × ${xLabel}`}>
        {yTicks.map((t) => (
          <g key={'y' + t}>
            <line className="gridline" x1={M.left} x2={W - M.right} y1={sy(t)} y2={sy(t)} />
            <text className="tick-label" x={M.left - 6} y={sy(t) + 3} textAnchor="end">
              {fmt(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={'x' + t}>
            <line className="gridline" x1={sx(t)} x2={sx(t)} y1={M.top} y2={H - M.bottom} />
            <text className="tick-label" x={sx(t)} y={H - M.bottom + 16} textAnchor="middle">
              {fmt(t)}
            </text>
          </g>
        ))}

        <text className="axis-label" x={W / 2} y={H - 6} textAnchor="middle">
          {xLabel}
        </text>
        <text
          className="axis-label"
          x={14}
          y={H / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${H / 2})`}
        >
          {yLabel}
        </text>

        {series.map((s, idx) => {
          const color = s.highlight ? ACCENT : s.color ?? (idx === 0 ? NEUTRAL : ACCENT)
          const focused = hasHighlight && !s.highlight
          const d = s.points
            .map((p, k) => `${k === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
            .join(' ')
          return (
            <g key={s.label} className={focused ? 'series-muted' : 'series-active'}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={s.highlight ? 2.6 : 2}
                strokeDasharray={s.dashed ? '6 4' : undefined}
              />
              {s.points.map((p, k) => (
                <circle
                  key={k}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={3}
                  fill="var(--bg)"
                  stroke={color}
                  strokeWidth={1.5}
                />
              ))}
            </g>
          )
        })}

        {series.map((s, idx) => (
          <g key={'leg' + s.label}>
            <rect
              className="legend-swatch"
              x={M.left + 12}
              y={M.top + 4 + idx * 18}
              width={14}
              height={4}
              fill={s.highlight ? ACCENT : s.color ?? (idx === 0 ? NEUTRAL : ACCENT)}
            />
            <text className="legend" x={M.left + 32} y={M.top + 9 + idx * 18}>
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}