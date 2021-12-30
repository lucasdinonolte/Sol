; Draws horizontal stripes to the screen

(def size 500)
(def c 20)
(def h (/ size (* 2 c)))
(def rectStyle { :fill "#000000" })

(draw <size size> [
  (map (range c) (=> [n i] (
    (rect <0 (+ (/ h 2) (* h i 2))> <size h> rectStyle)
  )))
])
