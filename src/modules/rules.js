+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {
  // MODULE BODY
  var ranks = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A']
  var suits = ['C', 'D', 'H', 'S']

  function allowDrag(card)
  {
    var childCard = card.prop.childCard
    return ranks[ranks.indexOf(card.rank) + 1] === childCard.rank &&
      card.suit === childCard.suit
  }

  function allowStickTo(card, stickToCard)
  {
    // console.log(card.rank, stickToCard.rank)
    return ranks[ranks.indexOf(card.rank) - 1] === stickToCard.rank
  }

  // MODULE EXPORT
  return {
    rules: {
      allowDrag    : allowDrag,
      allowStickTo : allowStickTo,
      ranks        : ranks,
      suits        : suits
    }
  }
})
