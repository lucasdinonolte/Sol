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
    case 'StringLiteral':
      return exp.value
    
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
