export default (tokens) => {
  let current = 0
  let hasOpen = false

  const error = (message) => {
    const lastToken = tokens[current - 1]
    throw new Error(`${message} (${lastToken.line}:${lastToken.column})`)
  }

  const walk = () => {
    let token = tokens[current]

    if (token.type === 'number') {
      current++

      return {
        type: 'NumberLiteral',
        value: parseFloat(token.value),
      }
    }

    if (token.type === 'string') {
      current++

      return {
        type: 'StringLiteral',
        value: token.value,
      }
    }

    if (token.type === 'color') {
      current++

      return {
        type: 'ColorLiteral',
        value: token.value,
      }
    }

    if (token.type === 'name') {
      current++

      return {
        type: 'Variable',
        value: token.value,
      }
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current]

      let node

      if (token.type === 'paren' && token.value === '(') {
        node = {
          type: 'Program',
          params: [],
        }

        while ( (token.type !== 'paren') || (token.type === 'paren' && token.value !== ')') ) {
          node.params.push(walk())
          token = tokens[current]
        }
      } else {
        if (token.value === 'def') {
          token = tokens[++current]
          node = {
            type: 'Assignment',
            name: token.value,
            params: [],
          }
        } else if (token.value === 'param') {
          node = {
            type: 'ExposedParameter',
            params: [],
          }
        } else if (token.value === 'if') {
          node = {
            type: 'Condition',
            params: [],
          }
        } else if (token.value === '=>') {
          node = {
            type: 'Function',
            name: token.value,
            params: []
          }
        } else if (token.type === 'operator' || token.type === 'name') {
          node = {
            type: 'CallExpression',
            name: token.value,
            params: [],
          }
        } else {
          throw new Error('Unknown List Type')
        }

        token = tokens[++current]

        while ( (token.type !== 'paren') || (token.type === 'paren' && token.value !== ')') ) {
          node.params.push(walk())
          token = tokens[current]

          if (token === undefined) error('Unbalanced Parenthesis')
        }
      }

      hasOpen = false

      current++
      return node
    }

    if (token.type === 'operator' && token.value === '<') {
      token = tokens[++current]

      let node = {
        type: 'Vector',
        values: [],
      }

      while ( (token.value !== '>') ) {
        node.values.push(walk())
        token = tokens[current]

        if (token === undefined) error('Unclosed Vector')
      }

      current++
      return node
    }

    if (token.type === 'bracket' && token.value === '[') {
      token = tokens[++current]

      let node = {
        type: 'List',
        values: [],
      }

      while ( (token.value !== ']') ) {
        node.values.push(walk())
        token = tokens[current]
      }

      current++
      return node
    }

    if (token.type === 'curly' && token.value === '{') {
      token = tokens[++current]

      let node = {
        type: 'Map',
        values: []
      }

      while ( (token.type !== 'curly' && token.value !== '}') ) {
        node.values.push(walk())
        token = tokens[current]
      }

      current++
      return node
    }

    if (token.type === 'symbol') {
      current++

      return {
        type: 'Symbol',
        value: token.value,
      }
    }

    error(`Unexpected ${token.type}`)
  }

  let ast = {
    type: 'Program',
    params: [],
  }

  while (current < tokens.length) {
    ast.params.push(walk());
  }

  return ast
}
