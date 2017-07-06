var CARD_WIDTH  = 150
var CARD_HEIGHT = 218
var ZOOM_FACTOR = 1.6

var elPerspective = document.getElementsByClassName("perspective-origin")[0]
var elTransform   = document.getElementsByClassName("transform-layer")[0]
var elFace        = document.getElementsByClassName("card-face")[0]

elTransform.style.width  = `${CARD_WIDTH}px`
elTransform.style.height = `${CARD_HEIGHT}px`

var transform = new TransformCard(elPerspective, elTransform)

transform.offsetX = CARD_WIDTH  / 2
transform.offsetY = CARD_HEIGHT / 2

dragCard(elFace, transform)

elFace.addEventListener("mousedown", function() {
  elTransform.style.width  = `${CARD_WIDTH  * ZOOM_FACTOR}px`
  elTransform.style.height = `${CARD_HEIGHT * ZOOM_FACTOR}px`
  transform.offsetX = CARD_WIDTH  * ZOOM_FACTOR / 2
  transform.offsetY = CARD_HEIGHT * ZOOM_FACTOR / 2
  transform.translateX -= (CARD_WIDTH * ZOOM_FACTOR - CARD_WIDTH) / 2
  transform.translateY -= (CARD_HEIGHT * ZOOM_FACTOR - CARD_HEIGHT) / 2
  transform.apply()
})

elFace.addEventListener("dragend", function() {
  elTransform.style.width  = `${CARD_WIDTH}px`
  elTransform.style.height = `${CARD_HEIGHT}px`
  transform.offsetX = CARD_WIDTH  / 2
  transform.offsetY = CARD_HEIGHT / 2
  transform.translateX += (CARD_WIDTH * ZOOM_FACTOR - CARD_WIDTH) / 2
  transform.translateY += (CARD_HEIGHT * ZOOM_FACTOR - CARD_HEIGHT) / 2
  transform.apply()
})
