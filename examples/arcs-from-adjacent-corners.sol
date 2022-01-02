($ s 1000)
($ c 100)

($ SIZE [s] <s s>)
($ maxR [s] (* 2 s))

(def drawCircles [num origin] (
  (map (range num) (fn [n i] (
    (circle origin (* (+ 1 i) (/ maxR num)) { :stroke #f1f1f1 })
  )))
))

(const TL <0 0>)
(const TR <1 0>)
(const BL <0 1>)
(const BR <1 1>)
(const CENTER <0.5 0.5>)

($ positions ([
  BL
  BR
]))

($ bgColor #121212)

($ output [SIZE c positions bgColor] (draw [
  (rect <0 0> <s s> { :fill bgColor })
  (map positions (fn [pos] (
    (drawCircles c <(* s (vec/x pos)) (* s (vec/y pos))>)
  )))
]))
