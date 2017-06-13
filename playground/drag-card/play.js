
var transform = transformCard({
  elContainer    : document.getElementsByClassName("card")[0],
  elRotateBox    : document.getElementsByClassName("rotate-box")[0],
  elTransformBox : document.getElementsByClassName("transform-box")[0]
})

dragCard({
  elContainer: document.getElementsByClassName("card")[0],
  elInteract: document.getElementsByClassName("face")[0]
}, transform)
