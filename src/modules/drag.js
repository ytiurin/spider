+function() {

  var DEBUG = !1
  var BLOCK_TIMEOUT = 1000 / 60 + 1

  function log()
  {
    if (DEBUG)
      console.log.apply(window, arguments)
  }

  function applyCoordsToEvent(event)
  {
    event.clientX = clientX
    event.clientY = clientY
    event.targetStartX = targetStartX
    event.targetStartY = targetStartY

    return event;
  }

  function dispatchDragEnd()
  {
    isDragging = 0
    isStarting = 1
    dispatchEvent(target,
      applyCoordsToEvent(
        new Event('dragend', {bubbles: true})))
  }

  function dispatchEvent(target, event)
  {
    target && target.dispatchEvent(event)
  }

  function mouseDown(e)
  {
    log("MOUSEDOWN")

    isDragging = 1
    target = e.target
    targetStartX = e.offsetX
    targetStartY = e.offsetY
  }

  function mouseLeave()
  {
    dispatchDragEnd()
  }

  function mouseMove(e)
  {
    if (!isDragging)
      return;

    log("DRAG")
    clientX = e.clientX
    clientY = e.clientY

    dispatchDrag()
  }

  function mouseUp(e)
  {
    // console.log(e)
    dispatchDragEnd(e.client)
  }

  function dispatchDrag()
  {
    // clientX, e.clientY
    if (!target)
      return;

    if (isStarting) {
      isStarting = 0
      dispatchEvent(target,
        applyCoordsToEvent(
          new Event('dragstart', {bubbles: true})))
    }

    if (!blockResponse) {
      blockResponse = 1
      dispatchEvent(target,
        applyCoordsToEvent(
          new Event('drag', {bubbles: true})))
    }
  }

  function preventSelection()
  {
    document.body.style.webkitTouchCallout =
    document.body.style.webkitUserSelect =
    document.body.style.khtmlUserSelect =
    document.body.style.mozUserSelect =
    document.body.style.msUserSelect =
    document.body.style.userSelect = 'none'
  }

  function touchEnd(e)
  {
    dispatchDragEnd()
  }

  function touchMove(e)
  {
    // console.log(e)
    clientX = e.touches[0].clientX >> 0
    clientY = e.touches[0].clientY >> 0

    dispatchDrag()
  }

  function touchStart(e)
  {
    // console.log(e)
    target = e.target
    var rect = target.getBoundingClientRect()
    targetStartX = e.targetTouches[0].clientX - rect.left
    targetStartY = e.targetTouches[0].clientY - rect.top
  }

  setInterval(function() {
    blockResponse = 0
  }, BLOCK_TIMEOUT)

  var isDragging = 0
  var isStarting = 1
  var blockResponse = 0
  var target
  var clientX = 0
  var clientY = 0
  var targetStartX = 0
  var targetStartY = 0

  document.addEventListener("mousedown", mouseDown)
  document.addEventListener("mouseleave", mouseLeave)
  document.addEventListener("mousemove", mouseMove)
  document.addEventListener("mouseup", mouseUp)

  document.addEventListener("touchend", touchEnd)
  document.addEventListener("touchmove", touchMove)
  document.addEventListener("touchstart", touchStart)

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", preventSelection)
  else
    preventSelection()

} ()
