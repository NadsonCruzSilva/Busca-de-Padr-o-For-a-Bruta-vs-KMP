import { Prism } from 'prism-react-renderer'

// O prism-react-renderer não inclui a gramática Java por padrão — sem ela,
// todo o código renderiza como texto simples. Registramos aqui um subset
// da gramática do PrismJS, com garantia de registro único.
export function registerJava() {
  if (Prism.languages.java) return

  const java = Prism.languages.extend('clike', {
    'class-name': [
      /\b[A-Z]\w*(?=\s+\w+\s*[;(,{])/,
      /\b[A-Z]\w*(?=\s+[A-Z]\w*\s*[.(])/,
      /\b[A-Z]\w*/,
      /(?<=\b(?:extends|implements|new|instanceof)\s+)\w+/,
    ],
    keyword:
      /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|public|record|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    number:
      /\b(?:0b[01_]+|0x[\da-fA-F_]+|(?:\d[\d_]*)(?:\.\d[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)[fdlFDL]?\b/,
    char: /'(?:\\[\s\S]|[^'\\\r\n])'/,
    operator: {
      pattern: /(^|[^.])(?:->|>>>=?|>>=?|<<=?|&&|\|\||[+\-*/%&|^~!=<>]=?)/,
      lookbehind: true,
    },
    annotation: /(^|[^.])@\w+/,
  })

  Prism.languages.java = java
}