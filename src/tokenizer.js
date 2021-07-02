module.exports = (input) => {
  const WHITESPACE = /\s/
  const NUMBERS = /[0-9]/
  const LETTERS = /[a-z]/i
  const KEYWORDS = ' def fn '

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
      })

      continue
    }

    if (ch === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      })

      continue
    }

    // WHITESPACE
    if (WHITESPACE.test(ch)) {
      continue
    }

    // COMMENTS
    if (ch === '#') {
      while(ch !== '\n') {
        ch = next()
      }

      continue
    }

    // NUMBERS
    if (NUMBERS.test(ch)) {
      let value = ch 

      while(NUMBERS.test(peek())) {
        ch = next()
        value += ch
      }

      tokens.push({ type: 'number', value })

      continue
    }

    // STRING LITERALS
    if (ch === '"') {
      let value = ''

      let ch = next()

      while (ch !== '"') {
        value += ch
        ch = next()
      }

      tokens.push({ type: 'string', value })

      continue
    }

    // NAMES AND KEYWORDS
    if (LETTERS.test(ch)) {
      let value = ch 

      while (LETTERS.test(peek())) {
        ch = next()
        value += ch
      }

      tokens.push({ type: 'name', value })

      continue
    }

    error(`Unexpected input ${ch}`)
  }

  return tokens
}
