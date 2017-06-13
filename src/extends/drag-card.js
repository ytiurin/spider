+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  // MODULE BODY
  var DEBUG = 0;

  var ROTATION_X_POS_LIMIT = 10
  var ROTATION_X_NEG_LIMIT = -10
  var ROTATION_Y_POS_LIMIT = 20
  var ROTATION_Y_NEG_LIMIT = -20

  function log()
  {
    DEBUG && console.log.apply(window, arguments)
  }

  function applyLimit(value, posLimit, negLimit)
  {
    value = value > posLimit ? posLimit : value
    value = value < negLimit ? negLimit : value

    return value
  }

  function dragCard(elements, transform, eventHandlers)
  {
    function applyRotation()
    {
      cancelAnimationFrame(applyRotationAFID)
      applyRotationAFID = requestAnimationFrame(function() {
        transform.rotate3d(rotateXDeg, rotateYDeg, 0)
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

      transform.translate3d(
        e.clientX - e.targetStartX,
        e.clientY - e.targetStartY,
        null)

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
      transform.translate3d(null, null, 100)
    }

    function dragend(e)
    {
      transform.translate3d(null, null, 0)

      eventHandlers && eventHandlers.dragend
        && eventHandlers.dragend(translateX, translateY,
          translateX + cardWidth, translateY + cardHeight)
    }

    var elContainer    = elements.elContainer
    var elInteract     = elements.elInteract

    var prevDragX  = 0
    var prevDragY  = 0
    var rotateXDeg = 0
    var rotateYDeg = 0

    var tendRotationAFID  = 0
    var tendRotationTOID  = 0
    var applyRotationAFID = 0

    var isLifted = !1

    elInteract.addEventListener("drag",      drag)
    elInteract.addEventListener("mousedown", mousedown)
    elInteract.addEventListener("dragend",   dragend)
  }

  // MODULE EXPORT
  return {
    dragCard: dragCard
  }
})
