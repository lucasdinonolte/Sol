import rep from '../src/lang/rep.js'
import tokenizer from '../src/lang/tokenizer.js'
import parser from '../src/lang/parser.js'
import Vector from '../src/lang/lib/Vector.js'

describe('Sol Language', () => {
  describe('Data Types', () => {
    it('should evaluate numbers', () => {
      expect(rep('1')).toBe(1)
      expect(rep('-1')).toBe(-1)
      expect(rep('1.2')).toBe(1.2)
      expect(rep('-1.2')).toBe(-1.2)
    })

    it('should evaluate strings', () => {
      expect(rep('"Hello"')).toBe("Hello")
    })

    it('should evaluate arrays', () => {
      expect(rep('[1 2 3]')).toStrictEqual([1, 2, 3])
    })

    it('should evaluate maps', () => {
      expect(rep('{ :hallo "Welt" }')).toStrictEqual({ hallo: "Welt" })
    })

    it('should evaluate colors', () => {
      expect(rep('#000000')).toBe('#000000')
    })

    it('should evaluate vectors', () => {
      expect(rep('<1 1>')).toStrictEqual(new Vector(1, 1))
      expect(rep('<-1 0.5>')).toStrictEqual(new Vector(-1, 0.5))
    })
  })

  describe('Prefix Notation', () => {
    it('should evaluate from inside to outside', () => {
      expect(rep('(+ 5 (* 3 (/ 5 10)))')).toBe(6.5)
      expect(rep('[1 (+ 2 2)]')).toStrictEqual([1, 4])
    })
  })

  describe('Runtime', () => {
    it('should assign consts', () => {
      expect(rep('(const a "b") a')).toBe('b')
    })

    it('should not allow overriding of const values', () => {
      expect(() => rep('(const test 1)(const test 2)')).toThrow()
    })

    it('should assign lets', () => {
      expect(rep('($ a "b") a')).toBe('b')
      expect(rep('($ a 10) a')).toBe(10)
    })

    it('should allow overriding of let values', () => {
      expect(rep('($ a "b") ($ a "c") a')).toBe('c')
    })

    it('should not allow let in nested scopes', () => {
      expect(() => rep('(def myFunction [] ((let a "b"))) (myFunction)')).toThrow()
    })

    it('should assign reactive lets', () => {
      expect(rep('($ a "b") a')).toBe('b')
      expect(rep('($ a [] "b") a')).toBe('b')
    })

    it('should update reactive lets when a watched let changes', () => {
      expect(rep('($ a 10) ($ b [a] (* a 2)) b')).toBe(20)
      expect(rep('($ a 10) ($ b [a] (* a 2)) ($ a 20) b')).toBe(40)
    })
  })
})
