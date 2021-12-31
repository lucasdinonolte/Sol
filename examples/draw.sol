(def size 500)
(def c 40)
(def h (/ size (* 2 c)))
(def rectStyle { :fill "#ff0000" })

(draw <size size> [
  (map (range c) (=> [n i] (
    (rect <0 (+ (/ h 2) (* h i 2))> <size h> rectStyle)
  )))
])
