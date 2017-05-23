
setInterval(function() {
  document.getElementById('c3').classList.toggle('lifted')
  document.getElementById('c6').classList.toggle('lean-left')
  document.getElementById('c6').classList.toggle('lean-right')
  document.getElementById('c9').classList.toggle('lean-top')
  document.getElementById('c9').classList.toggle('lean-bottom')
  document.getElementById('c12').classList.toggle('lean-top-left')
  document.getElementById('c12').classList.toggle('lean-top-right')
  document.getElementById('c15').classList.toggle('lean-bottom-left')
  document.getElementById('c15').classList.toggle('lean-bottom-right')
}, 1000)

var card = document.getElementById('c1')
var cardTranslate = document.querySelector('#c1 .translate-box')
var cardRotate = document.querySelector('#c1 .rotate-box')
var cardFace = document.querySelector('#c1 .face')
card.addEventListener("drag", function(e) {
  var top = document.body.scrollTop
  cardTranslate.style.transform = `translate3d(${e.x - e.offsetX}px,${top + e.y - e.offsetY}px,0)`
})

card.addEventListener("dragstart", function(e) {
  card.classList.add("lifted")
})

card.addEventListener("dragend", function(e) {
  card.classList.remove("lifted")
})
