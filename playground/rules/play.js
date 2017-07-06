var cards = []
var n = 0
suit = rules.suits[0]
for (var rank of rules.ranks) {
  // for (var suit of rules.suits) {
    var card = new CardComponent
    ++n > 15 && (n = 1)
    card.rank = rank
    card.suit = suit
    card.set({
      className : `color-${n}`,
      innerHTML : suit + rank,
      width     : 150,
      height    : 218
    })
    cards.push(card)
  // }
}

var cardA, cardB, i = 0, j = 0
while (cardA = cards[i++]) {
  while (cardB = cards[j++])
    if (rules.allowStickTo(cardA, cardB))
      cardA.allowStickToCard(cardB)
  j = 0
}

setTimeout(function() {
  cards.map(function(card) {
    var x = window.innerWidth * Math.random()
    var y = window.innerHeight * Math.random()
    card.transform.translate3d(x, y, null)
  })
})
