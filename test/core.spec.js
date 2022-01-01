import rep from '../src/lang/rep.js'

describe('Sol Core Library', () => {
  describe('Logic Values', () => {
    it('should have true and false builtins', () => {
      expect(rep('true')).toBeTruthy()
      expect(rep('false')).toBeFalsy()
    })
  })

  describe('Basic Math', () => {
    it('should add numbers', () => {
      expect(rep('(+ 2 2)')).toBe(4)
      expect(rep('(+ 2 2 2)')).toBe(6)
      expect(rep('(+ 1 2 2 4)')).toBe(9)
    })

    it('should subtract numbers', () => {
      expect(rep('(- 2 2)')).toBe(0)
      expect(rep('(- 2 2 2)')).toBe(-2)
      expect(rep('(- 1 2 2 4)')).toBe(-7)
    })

    it('should multiply numbers', () => {
      expect(rep('(* 2 2)')).toBe(4)
      expect(rep('(* 2 2 2)')).toBe(8)
      expect(rep('(* 1 2 2 4)')).toBe(16)
    })

    it('should divide numbers', () => {
      expect(rep('(/ 2 2)')).toBe(1)
      expect(rep('(/ 2 2 2)')).toBe(0.5)
      expect(rep('(/ 1 2 2 4)')).toBe(0.0625)
    })

    it('should compare numbers', () => {
      expect(rep('(< 1 2)')).toBeTruthy()
      expect(rep('(< 2 1)')).toBeFalsy()
      expect(rep('(> 2 1)')).toBeTruthy()
      expect(rep('(> 1 2)')).toBeFalsy()
      expect(rep('(>= 2 1)')).toBeTruthy()
      expect(rep('(>= 2 2)')).toBeTruthy()
      expect(rep('(>= 1 2)')).toBeFalsy()
      expect(rep('(<= 1 2)')).toBeTruthy()
      expect(rep('(<= 2 2)')).toBeTruthy()
      expect(rep('(<= 2 1)')).toBeFalsy()
    })
  })
})
