+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  // MODULE BODY
  var DEBUG = 0;

  function log()
  {
    DEBUG && console.log.apply(window, arguments)
  }

  function transformCard(elements)
  {
    function rotate3d(xDeg, yDeg, zDeg)
    {
      rotateXDeg = xDeg === null ? rotateXDeg : xDeg
      rotateYDeg = yDeg === null ? rotateYDeg : yDeg
      rotateZDeg = zDeg === null ? rotateZDeg : zDeg

      elRotateBox.style.transform = `rotate3d(1,0,0,${rotateXDeg}deg) rotate3d(0,1,0,${rotateYDeg}deg) rotate3d(0,0,1,${rotateZDeg}deg)`
    }

    function translate3d(x, y, z)
    {
      translateX = x === null ? translateX : x + cardWidth
      translateY = y === null ? translateY : y + cardHeight
      translateZ = z === null ? translateZ : z

      elTransformBox.style.transform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)`
      elContainer.style.perspectiveOrigin =
        `${translateX + (cardWidth / 2 >> 0)}px ` +
        `${translateY + (cardHeight / 2 >> 0)}px`
    }

    var elContainer    = elements.elContainer
    var elRotateBox    = elements.elRotateBox
    var elTransformBox = elements.elTransformBox

    setTimeout(function() {
      var rect = elContainer.getBoundingClientRect()
      cardWidth  = rect.width
      cardHeight = rect.height
      elContainer.style.left = -rect.width + 'px'
      elContainer.style.top  = -rect.height + 'px'

      translate3d(0, 0, 0)
    })

    var rotateXDeg = 0
    var rotateYDeg = 0
    var rotateZDeg = 0
    var translateX = 0
    var translateY = 0
    var translateZ = 0

    return {
      rotate3d: rotate3d,
      translate3d: translate3d
    }
  }

  // MODULE EXPORT
  return {
    transformCard: transformCard
  }
})