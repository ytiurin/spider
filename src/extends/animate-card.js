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

  function animateCard(transform)
  {
    function move(x, y)
    {
      transform.translate3d(x, y, null);
      transform.rotate3d(0, 0, 0);
    }

    return {
      move: move
    }
  }

  // MODULE EXPORT
  return {
    animateCard: animateCard
  }
})
