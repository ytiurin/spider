var cards = []
var n = 0

for (var rank of rules.ranks) {
  for (var suit of rules.suits) {
    var card = new CardComponent
    ++n > 15 && (n = 1)
    card.rank = rank
    card.suit = suit
    card.set('className', `color-${n}`)
    card.set('innerHTML', suit + rank)
    cards.push(card)
  }
}
console.log(cards.map(function(card){return card.suit+card.rank}))
var cardA, cardB, i = 0, j = 0
while (cardA = cards[i++]) {
  while (cardB = cards[j++]) {
    console.log(cardA.suit+cardA.rank, cardB.suit+cardB.rank)
    console.log(cardA)
    if (rules.allowStickTo(cardA, cardB)) {
      cardA.allowStickToCard(cardB)

    }
  }
  j = 0
}

setTimeout(function() {
  cards.map(function(card) {
    var x = window.innerWidth * Math.random()
    var y = window.innerHeight * Math.random()
    card.transform.translate3d(x, y, null)
  })
})
