+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  // MODULE BODY

  // MODULE EXPORT
  return {
    // ModuleName: ModuleConstructor
  }
})
