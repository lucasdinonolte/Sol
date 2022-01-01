# Sol
A declarative functional and reactive language for creative coding. Initially created to
learn more about parsers and interpreters.

```
; let declares state
; state can be changed and will cause a re-render
(let s 1000)
(let c 100)

; => declares a derived value
; will be re-calculated if s changes
(=> SIZE [s] <s s>)
(=> maxR [s] (* 2 s))

; def declares a named function
(def drawCircles [num origin] (
  (map (range num) (fn [n i] (
    (circle origin (* (+ 1 i) (/ maxR num)) { :stroke #f1f1f1 })
  )))
))

; const declares a constant
; cannot be changed
(const TL <0 0>)
(const TR <1 0>)
(const BL <0 1>)
(const BR <1 1>)
(const CENTER <0.5 0.5>)

(let positions [
  BL
  BR
])

(let bgColor #121212)

(=> output [SIZE c positions bgColor] (draw [
  (rect <0 0> <s s> { :fill bgColor })
  (map positions (fn [pos] (
    (drawCircles c <(* s (vec/x pos)) (* s (vec/y pos))>)
  )))
]))
```

## Usage
Should not yet be used for anything serious. But if you want to play with it,
clone this repo and run.

```
npm run cli path/to/your/sketch.sol # or yarn or pnpm …
```

## Why Sol?
Named after conceptual artist [Sol LeWitt](https://en.wikipedia.org/wiki/Sol_LeWitt).

## Is this a stupid idea?
Mostly yes, but also interesting.

## Inspiration
- [Jamie Kyle's Super tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
- [Mihai Bazon's: How to implement a programming language in JavaScript](https://lisperator.net/pltut/)
- [Clojure](https://clojure.org/)
- [Dacein](https://github.com/szymonkaliski/dacein)
