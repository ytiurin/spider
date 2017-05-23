
document.addEventListener("drag", function(e) {
  rps++
  document.getElementById('coords').innerHTML = e.clientX + "x" + e.clientY
  document.getElementById('vline').style.transform = `translate3d(0,${e.clientY}px,0)`
  document.getElementById('hline').style.transform = `translate3d(${e.clientX}px,0,0)`
})

document.addEventListener("dragstart", function(e) {
  document.getElementById('eventname').innerHTML = 'DRAGSTART'
})

document.addEventListener("dragend", function(e) {
  document.getElementById('eventname').innerHTML = 'DRAGEND'
})

var img = document.getElementById('image')
img.addEventListener("drag", function(e) {
  // console.log(e)
  var top = document.body.scrollTop
  e.target.style.transform = `translate3d(${e.clientX - e.targetStartX}px, ${top + e.clientY - e.targetStartY}px, 0)`
})

var eps = 0, rps = 0

document.body.addEventListener("mousemove", function() {
  eps++
})

document.body.addEventListener("touchmove", function(e) {
  e.preventDefault();
  eps++
})

setInterval(function() {
  document.getElementById('eps').innerHTML = eps + "EPS"
  document.getElementById('rps').innerHTML = rps + "RPS"
  eps = rps = 0
}, 1000)
