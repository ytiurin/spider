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

  function animateCard(elements)
  {
    function move()
    {}

    return {
      move: move
    }
  }

  // MODULE EXPORT
  return {
    animateCard: animateCard
  }
})
