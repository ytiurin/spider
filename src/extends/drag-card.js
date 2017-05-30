+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  var DEBUG = 1;

  // MODULE BODY
  var ROTATION_X_POS_LIMIT = 10
  var ROTATION_X_NEG_LIMIT = -10
  var ROTATION_Y_POS_LIMIT = 20
  var ROTATION_Y_NEG_LIMIT = -20

  function log()
  {
    if (DEBUG)
      console.log.apply(window, arguments)
  }

  function applyLimit(value, posLimit, negLimit)
  {
    value = value > posLimit ? posLimit : value
    value = value < negLimit ? negLimit : value

    return value
  }

  function dragCard(elements)
  {
    function applyRotation()
    {
      cancelAnimationFrame(applyRotationAFID)
      applyRotationAFID = requestAnimationFrame(function() {
        elRotateBox.style.transform = `rotate3d(1,0,0,${rotateXDeg}deg) rotate3d(0,1,0,${rotateYDeg}deg)`
      })
    }

    function persistRotationTo(XDeg, YDeg)
    {
      if (XDeg !== rotateXDeg)
        rotateX(rotateXDeg > XDeg ? -1 : 1)

      if (YDeg !== rotateYDeg)
        rotateY(rotateYDeg > YDeg ? -1 : 1)

      applyRotation()

      if (XDeg === rotateXDeg && YDeg === rotateYDeg)
        return

      tendRotationAFID = requestAnimationFrame(function() {
        persistRotationTo(XDeg, YDeg)
      })
    }

    function tendRotationTo(XDeg, YDeg)
    {
      cancelAnimationFrame(tendRotationAFID)
      tendRotationAFID = requestAnimationFrame(function() {
        persistRotationTo(XDeg, YDeg)
      })
    }

    function rotateX(speed)
    {
      rotateXDeg = applyLimit(rotateXDeg + speed, ROTATION_X_POS_LIMIT, ROTATION_X_NEG_LIMIT)
    }

    function rotateY(speed)
    {
      rotateYDeg = applyLimit(rotateYDeg + speed, ROTATION_Y_POS_LIMIT, ROTATION_Y_NEG_LIMIT)
    }

    function drag(e)
    {
      log("DRAG CARD")

      translateX = e.clientX - e.targetStartX
      translateY = e.clientY - e.targetStartY
      elTransformBox.style.transform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)`
      elContainer.style.perspectiveOrigin =
        `${e.clientX - e.targetStartX + (cardWidth / 2 >> 0)}px ` +
        `${e.clientY - e.targetStartY + (cardHeight / 2 >> 0)}px`

      var YSpeed = e.clientX - (prevDragX || e.clientX)
      var XSpeed = e.clientY - (prevDragY || e.clientY)

      rotateX(-XSpeed)
      rotateY(YSpeed)

      applyRotation()

      prevDragX = e.clientX
      prevDragY = e.clientY

      tendRotationTo(0, 0);
    }

    function mousedown(e)
    {
      translateZ = 100
      elTransformBox.style.transform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)`
    }

    function dragend(e)
    {
      translateZ = 0
      elTransformBox.style.transform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)`
    }

    var elContainer = elements.elContainer
    var elInteract = elements.elInteract
    var elRotateBox = elements.elRotateBox
    var elTransformBox = elements.elTransformBox

    var translateX = 0
    var translateY = 0

    var prevDragX = 0
    var prevDragY = 0
    var rotateXDeg = 0
    var rotateYDeg = 0

    var tendRotationAFID = 0
    var tendRotationTOID = 0
    var applyRotationAFID = 0

    var isLifted = !1

    elInteract.addEventListener("drag", drag)
    elInteract.addEventListener("mousedown", mousedown)
    elInteract.addEventListener("dragend", dragend)

    var cardWidth
    var cardHeight

    setTimeout(function() {
      var rect = elContainer.getBoundingClientRect()
      cardWidth = rect.width
      cardHeight = rect.height
      // console.log(cardWidth,cardHeight)
    })
  }

  // MODULE EXPORT
  return {
    dragCard: dragCard
  }
})