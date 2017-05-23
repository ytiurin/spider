+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  var CardHTML = `
<div class="card">
  <div class="transform-box" transform-box>
    <div class="rotate-box" rotate-box>
      <div class="face" face></div>
    </div>
  </div>
</div>
`

  function CardComponent()
  {
    var component = new Component(this, CardHTML)

    smoothDrag({
      elContainer: component.publ.elements[0],
      elInteract: component.anchors.face[0],
      elRotateBox: component.anchors.rotateBox[0],
      elTransformBox: component.anchors.transformBox[0]
    })

    var nextCard

    

    component.mount()
  }

  // MODULE EXPORT
  return {
    CardComponent: CardComponent
  }
})
