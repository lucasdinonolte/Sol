class Observable {
  constructor(value, derived) {
    this.value = value
    this.handlers = []
    this.derived = derived
  }

  subscribe(fn) {
    this.handlers.push(fn)
  }

  notify() {
    this.handlers.forEach((item) => {
      item.call()
    })
  }

  update(v) {
    this.value = v
    this.notify()
  }

  getValue() {
    return this.value
  }
}

export default Observable
