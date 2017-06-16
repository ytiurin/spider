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
  var ROTATION_Z_POS_LIMIT = 10
  var ROTATION_Z_NEG_LIMIT = -10

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
      transform.rotate3d(rotateXDeg, rotateYDeg, rotateZDeg)
    }

    function persistRotationTo(XDeg, YDeg, ZDeg)
    {
      if (XDeg !== rotateXDeg)
        rotateX(rotateXDeg > XDeg ? -1 : 1)

      if (YDeg !== rotateYDeg)
        rotateY(rotateYDeg > YDeg ? -1 : 1)

      if (ZDeg !== rotateZDeg)
        rotateZ(rotateZDeg > ZDeg ? -1 : 1)

      applyRotation()

      if (XDeg === rotateXDeg && YDeg === rotateYDeg && ZDeg === rotateZDeg)
        return

      tendRotationAFID = requestAnimationFrame(function() {
        persistRotationTo(XDeg, YDeg, ZDeg)
      })
    }

    function tendRotationTo(XDeg, YDeg, ZDeg)
    {
      cancelAnimationFrame(tendRotationAFID)
      tendRotationAFID = requestAnimationFrame(function() {
        persistRotationTo(XDeg, YDeg, ZDeg)
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

    function rotateZ(speed)
    {
      rotateZDeg = applyLimit(rotateZDeg + speed, ROTATION_Z_POS_LIMIT, ROTATION_Z_NEG_LIMIT)
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

      rotateX(-XSpeed / 4 >> 0)
      rotateY(YSpeed / 4 >> 0)
      rotateZ(YSpeed / 4 >> 0)
      applyRotation()

      prevDragX = e.clientX
      prevDragY = e.clientY

      tendRotationTo(0, 0, 0);
    }

    function mousedown(e)
    {
      transform.translate3d(null, null, 100)
    }

    function dragend(e)
    {
      transform.translate3d(null, null, 0)
      rotateXDeg = 0
      rotateYDeg = 0
      rotateZDeg = 0
      applyRotation()
    }

    var elContainer    = elements.elContainer
    var elInteract     = elements.elInteract

    var prevDragX  = 0
    var prevDragY  = 0
    var rotateXDeg = 0
    var rotateYDeg = 0
    var rotateZDeg = 0

    var tendRotationAFID  = 0
    var tendRotationTOID  = 0

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
