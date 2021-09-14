module.exports = (tokens) => {
  let current = 0

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
          body: [],
        }

        while ( (token.type !== 'paren') || (token.type === 'paren' && token.value !== ')') ) {
          node.body.push(walk())
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
        } else if (token.value === 'if') {
          node = {
            type: 'Condition',
            params: [],
          }
        } else if (token.value === 'fn') {
          node = {
            type: 'Function',
            name: token.value,
            params: []
          }
        } else {
          node = {
            type: 'CallExpression',
            name: token.value,
            params: [],
          }
        }

        token = tokens[++current]

        while ( (token.type !== 'paren') || (token.type === 'paren' && token.value !== ')') ) {
          node.params.push(walk())
          token = tokens[current]
        }
      }

      current++
      return node
    }

    if (token.type === 'bracket' && token.value === '[') {
      token = tokens[++current]

      let node = {
        type: 'Vector',
        values: [],
      }

      while ( (token.type !== 'bracket') ) {
        node.values.push(walk())
        token = tokens[current]
      }

      current++
      return node
    }

    throw new TypeError(token.type)
  }

  let ast = {
    type: 'Program',
    body: [],
  }

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast
}
