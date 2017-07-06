+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  // MODULE BODY
  function TransformCard(elPerspective, elTransform)
  {
    // function origin(x, y)
    // {
    //   elTransform.style.transformOrigin = x && y ? `${x}px ${y}px` : ''
    // }

    this.offsetX    = 0
    this.offsetY    = 0
    this.originX    = 0
    this.originY    = 0
    this.rotateX    = 0
    this.rotateY    = 0
    this.rotateZ    = 0
    this.translateX = 0
    this.translateY = 0

    this.apply = function() {
      var originX = this.translateX + this.offsetX
      var originY = this.translateY + this.offsetY

      elPerspective.style.perspectiveOrigin = `${originX >> 0}px ${originY >> 0}px`

      elTransform.style.transform =
      `translate3d(${this.translateX >> 0}px,${this.translateY >> 0}px,${this.translateZ >> 0}px) ` +
      `rotate3d(1,0,0,${this.rotateX >> 0}deg) ` +
      `rotate3d(0,1,0,${this.rotateY >> 0}deg) ` +
      `rotate3d(0,0,1,${this.rotateZ >> 0}deg)`
    }
  }

  // MODULE EXPORT
  return {
    TransformCard: TransformCard
  }
})
