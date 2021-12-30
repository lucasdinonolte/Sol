import core from './core.js'
import Vector from './lib/vector.js'

class Environment {
  constructor(parent) {
    this.vars = Object.create(parent ? parent.vars : null)
    if (!parent) this.loadCore()
    this.parent = parent
  }

  loadCore() {
    core.forEach(item => {
      this.def(item[0], item[1])
    })
  }

  has(name) {
    return (name in this.vars)
  }

  def(name, value) {
    if (name in this.vars) throw new Error(`${name} is already assigned. (${JSON.stringify(this.vars[name])})`)

    return this.vars[name] = value
  }

  get(name) {
    if (name in this.vars) return this.vars[name]
    throw new Error(`Undefined variable ${name}`)
  }
}

const evaluate = (exp, env) => {
  if (!exp) return null

  switch (exp.type) {
    case 'NumberLiteral':
    case 'ColorLiteral':
    case 'StringLiteral':
      return exp.value
    case 'List':
      return [...(exp.values.map(val => evaluate(val, env)))]
    case 'Vector':
      if (exp.values.length !== 2) throw new Error('Only two dimensional vectors are supported')

      const x = evaluate(exp.values[0], env)
      const y = evaluate(exp.values[1], env)

      return new Vector(x, y)
    case 'Map':
      const map = {}
      for (let i = 0; i < exp.values.length;) {
        const key = evaluate(exp.values[i], env)
        const val = evaluate(exp.values[++i], env) || null
        map[key] = val
        i++
      } 
      return map
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
      exp.params.forEach((e) => { val = evaluate(e, env) }) 
      return val
    case 'Assignment':
      return env.def(exp.name, evaluate(exp.params[0], env))
    case 'CallExpression':
      const func = env.get(exp.name)
      return func.apply(null, exp.params.map((arg) => evaluate(arg, env)))
    case 'Symbol':
      return exp.value.substring(1)
    case 'ExposedParameter':
      return evaluate(exp.params[0], env)
    default:
      return null
  }
}

export {
  Environment,
  evaluate
}
