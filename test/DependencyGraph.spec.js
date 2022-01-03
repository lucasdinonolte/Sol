import DependencyGraph from '../src/lang/lib/DependencyGraph.js'

describe('Dependency Graph', () => {
  it('should be able to add and remove nodes', () => {
    let graph = new DependencyGraph()

    graph.addNode('a', 10)
    graph.addNode('b', 20)

    expect(graph.hasNode('a')).toBeTruthy()
    expect(graph.hasNode('b')).toBeTruthy()
    expect(graph.hasNode('c')).toBeFalsy()

    graph.removeNode('a')
    expect(graph.hasNode('a')).toBeFalsy()
  })

  it('should calculate its size', () => {
    let graph = new DependencyGraph()

    graph.addNode('a', 10)
    graph.addNode('b', 20)
    expect(graph.size()).toBe(2)

    graph.addNode('c', 10)
    expect(graph.size()).toBe(3)
  })

  it('should be able to set dependencies between nodes', () => {
    let graph = new DependencyGraph()

    graph.addNode('a', 10)
    graph.addNode('b', 20)
    graph.addNode('c', 30)

    graph.addDependency('a', 'b')
    graph.addDependency('a', 'c')

    expect(graph.dependenciesOf('a')).toStrictEqual(['c', 'b'])
    expect(graph.dependantsOf('c')).toStrictEqual(['a'])
    expect(graph.dependantsOf('b')).toStrictEqual(['a'])

    graph.removeDependency('a', 'c')
    expect(graph.dependenciesOf('a')).toStrictEqual(['b'])
    expect(graph.dependantsOf('c')).toStrictEqual([])
  })

  it('should still work after nodes are removed', () => {
    let graph = new DependencyGraph()

    graph.addNode('a', 10)
    graph.addNode('b', 20)
    graph.addNode('c', 30)

    graph.addDependency('a', 'b')
    graph.addDependency('b', 'c')

    expect(graph.dependenciesOf('a')).toStrictEqual(['b', 'c'])
    expect(graph.dependantsOf('c')).toStrictEqual(['b', 'a'])

    graph.removeNode('c')
    expect(graph.dependenciesOf('a')).toStrictEqual(['b'])
    expect(() => graph.dependantsOf('c')).toThrow()
  })
})

