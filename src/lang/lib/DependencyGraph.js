// Based on https://github.com/jriecken/dependency-graph/blob/master/lib/dep_graph.js

class DependencyGraph {
  constructor() {
    this.nodes = {}
    this.outgoingEdges = {}
    this.incomingEdges = {}
  }

  size() {
    return Object.keys(this.nodes).length
  }

  addNode(node, body) {
    if (!this.hasNode(node)) {
      this.outgoingEdges[node] = []
      this.incomingEdges[node] = []
    }

    this.nodes[node] = body
  }

  removeNode(node) {
    if (this.hasNode(node)) {
      delete this.nodes[node]
      delete this.outgoingEdges[node]
      delete this.incomingEdges[node]
      this.removeDependencies(node)
    }
  }

  hasNode(node) {
    return this.nodes.hasOwnProperty(node)
  }

  getNode(node) {
    if (this.hasNode(node)) return this.nodes[node]
  }

  addDependency(from, to) {
    if (!this.hasNode(from)) throw new Error(`${from} does not exist`)
    if (!this.hasNode(to)) throw new Error(`${to} does not exist`)
    if (!this.outgoingEdges[from].includes(to)) this.outgoingEdges[from].push(to)
    if (!this.incomingEdges[to].includes(from)) this.incomingEdges[to].push(from)
  }

  removeDependency(from, to) {
    let idx
    if (this.hasNode(from)) {
      idx = this.outgoingEdges[from].indexOf(to)
      if (idx >= 0) {
        this.outgoingEdges[from].splice(idx, 1)
      }
    }

    if (this.hasNode(to)) {
      idx = this.incomingEdges[to].indexOf(from)
      if (idx >= 0) {
        this.incomingEdges[to].splice(idx, 1)
      }
    }
  }

  removeDependencies(node) {
    const cleanEdgeList = (edgeList) => {
      Object.keys(edgeList).forEach((key) => {
        const idx = edgeList[key].indexOf(node)
        if (idx >= 0) {
          edgeList[key].splice(idx, 1)
        }
      })
    }

    cleanEdgeList(this.incomingEdges)
    cleanEdgeList(this.outgoingEdges)
  }

  dependenciesOf(node) {
    if (!this.hasNode(node)) throw new Error(`${node} does not exist`)
    let result = []
    const DFS = createDFS(this.outgoingEdges, false, result, false)
    DFS(node)
    if (result.includes(node)) result.splice(result.indexOf(node), 1)
    return result.reverse()
  }

  dependantsOf(node) {
    if (!this.hasNode(node)) throw new Error(`${node} does not exist`)
    let result = []
    const DFS = createDFS(this.incomingEdges, false, result, false)
    DFS(node)
    if (result.includes(node)) result.splice(result.indexOf(node), 1)
    return result.reverse()
  }
}

// Ported from https://github.com/jriecken/dependency-graph/blob/master/lib/dep_graph.js
const createDFS = (edges, leavesOnly, result, circular) => {
  let visited = {}
  return function (start) {
    if (visited[start]) {
      return
    }
    let inCurrentPath = {}
    let currentPath = []
    let todo = []
    todo.push({ node: start, processed: false })
    while (todo.length > 0) {
      var current = todo[todo.length - 1] // peek at the todo stack
      var processed = current.processed
      var node = current.node
      if (!processed) {
        // Haven't visited edges yet (visiting phase)
        if (visited[node]) {
          todo.pop()
          continue
        } else if (inCurrentPath[node]) {
          // It's not a DAG
          if (circular) {
            todo.pop()
            // If we're tolerating cycles, don't revisit the node
            continue
          }
          currentPath.push(node)
          throw new Error(currentPath)
        }

        inCurrentPath[node] = true
        currentPath.push(node)
        var nodeEdges = edges[node]
        // (push edges onto the todo stack in reverse order to be order-compatible with the old DFS implementation)
        for (let i = nodeEdges.length - 1; i >= 0; i--) {
          todo.push({ node: nodeEdges[i], processed: false })
        }
        current.processed = true
      } else {
        // Have visited edges (stack unrolling phase)
        todo.pop()
        currentPath.pop()
        inCurrentPath[node] = false
        visited[node] = true
        if (!leavesOnly || edges[node].length === 0) {
          result.push(node)
        }
      }
    }
  }
}

export default DependencyGraph
