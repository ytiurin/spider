+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  var CardHTML = `
<div class="card">
  <div class="transform-box" transform-box>
    <div class="face" face></div>
  </div>
</div>
`

  function pointBounded(x, y, bx, by, bxw, byh)
  {
    return x > bx && x < bxw && y > by && y < byh
  }

  function CardComponent()
  {
    function stickToCard(card)
    {
      component.props.parentCard = card
      card.props.childCard = component.publ

      animation.move(card.props.x, card.props.y + 100);
    }

    function dragend(e)
    {
      var x  = e.clientX - e.targetStartX
      var y  = e.clientY - e.targetStartY
      var xw = x + cardWidth
      var yh = y + cardHeight

      component.props.x  = x
      component.props.y  = y
      component.props.xw = xw
      component.props.yh = yh
      // console.log(x,y,xw,yh)

      var card = canStickToCards.reduce(function(r, card) {
        var cm = card.props;
        // console.log(cm.x,cm.y,cm.xw,cm.yh)
        if (
             pointBounded(x,  y,  cm.x, cm.y, cm.xw, cm.yh) // top left corner
          || pointBounded(xw, y,  cm.x, cm.y, cm.xw, cm.yh) // top right corner
          || pointBounded(x,  yh, cm.x, cm.y, cm.xw, cm.yh) // bottom left corner
          || pointBounded(xw, yh, cm.x, cm.y, cm.xw, cm.yh) // bottom right corner
          && (!r && 1 || card.props.zIndex > r.props.zIndex)
        )
          return card
        return r
      }, null)

      card && stickToCard(card)
    }

    var canAcceptStickyCards = []
    var canStickToCards      = []

    var childCard
    var parentCard

    var component = new Component(this, CardHTML)

    var elContainer    = component.publ.elements[0]
    var elInteract     = component.anchors.face[0]
    var elTransformBox = component.anchors.transformBox[0]

    var transform = transformCard({ elContainer: elContainer,
      elTransformBox: elTransformBox })

    dragCard({ elContainer: elContainer, elInteract: elInteract }, transform)

    var cardWidth
    var cardHeight

    setTimeout(function() {
      var rect = elContainer.getBoundingClientRect()
      cardWidth  = rect.width
      cardHeight = rect.height
    })

    elInteract.addEventListener("dragend", dragend)

    var animation = animateCard(transform)

    component.onUpdate({
      className: function(cn) {
        var el = component.publ.elements[0]
        !el.classList.contains(cn)
          && el.classList.add(cn)
      }
    })

    component.publ.allowStickyCard = function(card) {
      if (~canAcceptStickyCards.indexOf(card))
        return

      canAcceptStickyCards.push(card)
      card.allowStickToCard(component.publ)
    }

    component.publ.allowStickToCard = function(card) {
      if (~canStickToCards.indexOf(card))
        return

      canStickToCards.push(card)
      card.allowStickyCard(component.publ)
    }

    component.mount()
  }

  // MODULE EXPORT
  return {
    CardComponent: CardComponent
  }
})
