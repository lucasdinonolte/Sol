export default (input) => {
  const WHITESPACE = /\s/
  const NUMBERS = /[0-9.]/
  const LETTERS = /[a-z$]/i
  const COLOR = /[0-9a-z]/i
  const NAME = /[a-z0-9\/\?-]/i
  const OPERATORS = ' + - * / % = < <= > >= ! '
  const KEYWORDS = ' def let const fn $ if '

  let current = 0
  let line = 1
  let column = 0
  let tokens = []

  const next = () => {
    const ch = input.charAt(current++)
    if (ch === '\n') {
      line++
      column = 0
    } else {
      column++
    }

    return ch
  }

  const peek = () => input.charAt(current)
  const eof = () => peek() === ''
  const error = (msg) => {
    throw new Error(`${msg} (${line}:${column})`)
  }

  while (!eof()) {
    let ch = next()

    // PARENTHESIS
    if (ch === '(') {
      tokens.push({
        type: 'paren',
        value: '(',
        line,
        column,
      })

      continue
    }

    if (ch === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
        line,
        column,
      })

      continue
    }

    // COMMENTS
    if (ch === ';') {
      while (peek() !== '\n' && !eof()) {
        next()
      }

      continue
    }
    
    // BRACKETS
    if (ch === '[') {
      tokens.push({
        type: 'bracket',
        value: '[',
        line,
        column,
      })

      continue
    }

    if (ch === ']') {
      tokens.push({
        type: 'bracket',
        value: ']',
        line,
        column,
      })

      continue
    }

    // CURLY
    if (ch === '{') {
      tokens.push({
        type: 'curly',
        value: '{',
        line,
        column,
      })

      continue
    }

    if (ch === '}') {
      tokens.push({
        type: 'bracket',
        value: '}',
        line,
        column,
      })

      continue
    }

    // SYMBOLDS
    if (ch === ':') {
      let value = ch 

      while(LETTERS.test(peek())) {
        ch = next()
        value += ch
      }

      tokens.push({ type: 'symbol', value, line, column })

      continue
    }

    // WHITESPACE
    if (WHITESPACE.test(ch)) {
      continue
    }

    // COLOR LITERALS
    if (ch === '#') {
      let value = ch 

      while(COLOR.test(peek())) {
        ch = next()
        value += ch
      }

      tokens.push({ type: 'color', value, line, column })

      continue
    }

    // NUMBERS
    if (NUMBERS.test(ch) || (ch === '-' && NUMBERS.test(peek()))) {
      let value = ch 

      while(NUMBERS.test(peek())) {
        ch = next()
        value += ch
      }

      tokens.push({ type: 'number', value, line, column })

      continue
    }

    // STRING LITERALS
    if (ch === '"') {
      let value = ''

      let ch = next()

      while (ch !== '"') {
        if (eof()) {
          error('Unterminated String')
        }

        value += ch
        ch = next()
      }

      tokens.push({ type: 'string', value, line, column })

      continue
    }

    // OPERATORS
    if (OPERATORS.includes(` ${ch} `)) {
      let value = ch

      while (OPERATORS.includes(` ${value}${peek()} `) && !eof()) {
        ch = next()
        value += ch
      }

      tokens.push({ type: 'operator', value, line, column })

      continue
    }

    // NAMES AND KEYWORDS
    if (LETTERS.test(ch)) {
      let value = ch 

      while (NAME.test(peek())) {
        ch = next()
        value += ch
      }

      if (KEYWORDS.includes(` ${value} `)) {
        tokens.push({ type: 'keyword', value, line, column })
      } else {
        tokens.push({ type: 'name', value, line, column })
      }

      continue
    }

    error(`Unexpected input ${ch}`)
  }

  return tokens
}
