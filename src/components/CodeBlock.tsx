import { useState } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { registerJava } from '../lib/javaGrammar'

registerJava()

// Paleta inspirada em editores (One Dark / VS Code): cores distintas por
// token para dar cara de código de verdade.
const theme: PrismTheme = {
  plain: { color: '#abb2bf', backgroundColor: '#0d1117' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#7f848e', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#848b9a' } },
    { types: ['keyword', 'atrule', 'boolean', 'important'], style: { color: '#c678dd' } },
    { types: ['string', 'char', 'attr-value'], style: { color: '#98c379' } },
    { types: ['number', 'constant'], style: { color: '#d19a66' } },
    { types: ['function', 'method'], style: { color: '#61afef' } },
    { types: ['class-name', 'builtin'], style: { color: '#e5c07b' } },
    { types: ['variable', 'parameter'], style: { color: '#e06c75' } },
    { types: ['property', 'attr-name'], style: { color: '#e5c07b' } },
    { types: ['tag'], style: { color: '#e06c75' } },
    { types: ['operator'], style: { color: '#56b6c2' } },
  ],
}

export function CodeBlock({
  code,
  title,
  language = 'java',
  highlightLines,
  compact = false,
}: {
  code: string
  title: string
  language?: string
  highlightLines?: number[]
  compact?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={'codeblock' + (compact ? ' compact' : '')}>
      <div className="codeblock-head">
        <span className="traffic" aria-hidden="true">
          <span className="t" />
          <span className="t" />
          <span className="t" />
        </span>
        <span className="lang">{title}</span>
        <span className="head-meta">Java</span>
        <button
          className={'copy-btn' + (copied ? ' copied' : '')}
          onClick={copy}
        >
          {copied ? 'Copiado ✓' : 'Copiar código'}
        </button>
      </div>
      <Highlight code={code.trim()} language={language} theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => {
              const n = i + 1
              const hl = highlightLines?.includes(n)
              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className={'code-line' + (hl ? ' hl' : '')}
                >
                  <span className="gutter">{n}</span>
                  <span className="code-text">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              )
            })}
          </pre>
        )}
      </Highlight>
      {highlightLines && (
        <div className="codeblock-foot">
          linhas em destaque: {highlightLines.join(', ')}
        </div>
      )}
    </div>
  )
}