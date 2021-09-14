class Environment {

  constructor(parent) {
    this.vars = Object.create(parent ? parent.vars : null)
    this.parent = parent
  }

  def(name, value) {
    if (name in this.vars) throw new Error(`${name} is already assigned`)

    return this.vars[name] = value
  }

  get(name) {
    if (name in this.vars) return this.vars[name]
    throw new Error(`Undefined variable ${name}`)
  }
}

const evaluate = (exp, env) => {
  switch (exp.type) {
    case 'NumberLiteral':
    case 'ColorLiteral':
    case 'StringLiteral':
      return exp.value
    
    case 'Vector':
      return [...(exp.values.map(val => evaluate(val, env)))]
    case 'Function':
      return function() {
        const vars = exp.params[0].values.map(i => i.value)
        const body = exp.params[1]
        const scope = new Environment(env)
        for (let i = 0; i < vars.length; i++) {
          scope.def(vars[i], i < arguments.length ? arguments[i] : false)
        }
        return(evaluate(body, scope))
      }
    case 'Condition':
      const condition = evaluate(exp.params[0], env)
      const then = exp.params[1]
      return condition ? evaluate(then, env) : (!!exp.params[2] ? evaluate(exp.params[2], env) : false)
    case 'Variable':
      return env.get(exp.value)
    case 'Program':
      let val = false
      exp.body.forEach((e) => { val = evaluate(e, env) }) 
      return val
    case 'Assignment':
      return env.def(exp.name, evaluate(exp.params[0], env))
    case 'CallExpression':
      const func = env.get(exp.name)
      return func.apply(null, exp.params.map((arg) => evaluate(arg, env)))
  }
}

module.exports = {
  Environment,
  evaluate
}
