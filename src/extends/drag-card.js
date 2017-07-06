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

  function dragCard(element, transform)
  {
    function persistRotationTo(persistX, persistY, persistZ)
    {
      if (persistX !== transform.rotateX)
        rotateX(transform.rotateX > persistX ? -1 : 1)

      if (persistY !== transform.rotateY)
        rotateY(transform.rotateY > persistY ? -1 : 1)

      if (persistZ !== transform.rotateZ)
        rotateZ(transform.rotateZ > persistZ ? -1 : 1)

      transform.apply()

      if (persistX === transform.rotateX &&
          persistY === transform.rotateY &&
          persistZ === transform.rotateZ)
        return

      persistRotationTOID = setTimeout(function() {
        persistRotationTo(persistX, persistY, persistZ)
      }, 10)
    }

    function rotateX(speed)
    {
      var posLimit = ROTATION_X_POS_LIMIT
      var negLimit = ROTATION_X_NEG_LIMIT
      if (publ.hasChildCard) {
        posLimit = posLimit / 4 >> 0
        negLimit = negLimit / 4 >> 0
      }
      transform.rotateX = applyLimit(transform.rotateX + speed, posLimit, negLimit)
    }

    function rotateY(speed)
    {
      transform.rotateY = applyLimit(transform.rotateY + speed, ROTATION_Y_POS_LIMIT, ROTATION_Y_NEG_LIMIT)
    }

    function rotateZ(speed)
    {
      var posLimit = ROTATION_Z_POS_LIMIT
      var negLimit = ROTATION_Z_NEG_LIMIT
      if (publ.hasChildCard) {
        posLimit = posLimit / 4 >> 0
        negLimit = negLimit / 4 >> 0
      }
      transform.rotateZ = applyLimit(transform.rotateZ + speed, posLimit, negLimit)
    }

    function performDrag(e)
    {
      transform.translateX = e.clientX - e.targetStartX
      transform.translateY = e.clientY - e.targetStartY

      var YSpeed = e.clientX - (prevDragX || e.clientX)
      var XSpeed = e.clientY - (prevDragY || e.clientY)

      rotateX(-XSpeed / 4 >> 0)
      rotateZ( YSpeed / 4 >> 0)
      rotateY( YSpeed / 4 >> 0)

      transform.apply()

      prevDragX = e.clientX
      prevDragY = e.clientY

      clearTimeout(persistRotationTOID)
      persistRotationTOID = setTimeout(function() {
        persistRotationTo(0,0,0)
      }, 20)
    }

    function cancelTransform()
    {
      cancelAnimationFrame(dragAF)
      dragAF = 0
      if (!dragQueue.length)
        return
      performDrag(dragQueue.pop())
      dragQueue = []
    }

    function smoothTransform()
    {
      dragAF = requestAnimationFrame(function() {
        performDrag(dragQueue.shift())

        if (dragQueue.length)
          smoothTransform()
        else
          dragAF = 0
      })
    }

    function drag(e)
    {
      log("DRAG CARD")
      dragQueue.push(e)

      if (!dragAF)
        smoothTransform()
    }

    function mousedown(e)
    {
      // transform.origin(e.offsetX, e.offsetY)
    }

    function dragend(e)
    {
      cancelTransform()
      clearTimeout(persistRotationTOID)
      transform.rotateX = 0
      transform.rotateY = 0
      transform.rotateZ = 0
      transform.apply()
      // transform.origin()
    }

    function dragstart()
    {
      dragStartTime = new Date
    }

    var prevDragX  = 0
    var prevDragY  = 0

    var persistRotationTOID = 0
    var dragQueue = []
    var dragAF = 0
    var dragStartTime

    element.addEventListener("mousedown", mousedown)
    element.addEventListener("drag",      drag)
    element.addEventListener("dragend",   dragend)
    element.addEventListener("dragstart", dragstart)

    var publ = { hasChildCard: false }

    return publ
  }

  // MODULE EXPORT
  return {
    dragCard: dragCard
  }
})
