+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  var MAX_CHILD_CARD_DISTANCE = 60
  var DRAG_CHILD_CARD_DISTANCE = 10

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
    function applyCardBounds(x, y)
    {
      component.props.x  = x
      component.props.y  = y
      component.props.xw = x + cardWidth
      component.props.yh = y + cardHeight
    }

    function stickToCard(card)
    {
      if (component.props.parentCard)
        component.props.parentCard.set('childCard', null)

      component.props.parentCard = card
      card.set('childCard', component.publ)

      applyCardBounds(card.props.x, card.props.y + childCardDistance)

      animation.move(component.props.x, component.props.y)
    }

    function dragend(e)
    {
      var x  = e.clientX - e.targetStartX
      var y  = e.clientY - e.targetStartY

      applyCardBounds(x, y)

      var xw = component.props.xw
      var yh = component.props.yh

      var card = canStickToCards.reduce(function(r, card) {
        var cm = card.props;
        // console.log(cm.x,cm.y,cm.xw,cm.yh)
        if (
             !cm.childCard
          && pointBounded(x,  y,  cm.x, cm.y, cm.xw, cm.yh) // top left corner
          || pointBounded(xw, y,  cm.x, cm.y, cm.xw, cm.yh) // top right corner
          || pointBounded(x,  yh, cm.x, cm.y, cm.xw, cm.yh) // bottom left corner
          || pointBounded(xw, yh, cm.x, cm.y, cm.xw, cm.yh) // bottom right corner
          && (!r && 1 || card.props.zIndex > r.props.zIndex)
        ){
          console.log('THAT CARD', cm.x,cm.y,cm.xw,cm.yh)
          return card
        }
        return r
      }, null)

      card && stickToCard(card)
    }

    var canAcceptStickyCards = []
    var canStickToCards      = []

    var component = new Component(this, CardHTML)

    var elContainer    = component.publ.elements[0]
    var elInteract     = component.anchors.face[0]
    var elTransformBox = component.anchors.transformBox[0]

    var cardRect = { width: 0, height: 0 }

    var transform = transformCard(elContainer, elTransformBox, cardRect)

    var publTransform = {
      origin: function(x, y, childCardDistance) {
        transform.origin.apply({}, arguments)
        var childCard = component.props.childCard
        y = !y ? y : y - (childCardDistance || MAX_CHILD_CARD_DISTANCE)
        childCard && childCard.transform.origin(x, y, childCardDistance || 10)
      },
      rotate3d: function() {
        transform.rotate3d.apply({}, arguments)
        var childCard = component.props.childCard
        childCard && childCard.transform.rotate3d.apply({}, arguments)
      },
      translate3d: function(x, y, z, childCardDistance) {
        transform.translate3d.apply({}, arguments)
        if (x !== null && y !== null)
          applyCardBounds(x, y)
        var childCard = component.props.childCard
        y = y === null ? y : y + (childCardDistance || MAX_CHILD_CARD_DISTANCE)
        childCard && childCard.transform.translate3d(x, y, z, childCardDistance || 10)
      }
    }

    var drag = dragCard({ elContainer: elContainer, elInteract: elInteract }, publTransform)

    var cardWidth
    var cardHeight
    var childCardDistance = MAX_CHILD_CARD_DISTANCE

    setTimeout(function() {
      var rect = elContainer.getBoundingClientRect()
      cardWidth  = rect.width
      cardHeight = rect.height
    })

    elInteract.addEventListener("dragend", dragend)

    var animation = animateCard(publTransform)

    component.onUpdate({
      childCard: function(childCard) {
        drag.hasChildCard = !!childCard
      },
      className: function(cn) {
        var el = component.publ.elements[0]
        !el.classList.contains(cn)
          && el.classList.add(cn)
      },
      innerHTML: function(HTML) {
        elInteract.innerHTML = HTML
      }
    })

    component.publ.allowStickyCard = function(card) {
      if (card === component.publ || ~canAcceptStickyCards.indexOf(card))
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

    component.publ.transform = publTransform

    component.publ.rank = ''
    component.publ.suit = ''

    component.mount()
  }

  // MODULE EXPORT
  return {
    CardComponent: CardComponent
  }
})
