+function(factory, modules) {
  Object.keys(modules = factory()).map(function(name) {
    window[name] = modules[name]})
} (function() {

  function toArray(obj,fromIndex)
  {
    return Array.prototype.slice.call(obj,fromIndex);
  }

  function argsToObj(args)
  {
    var argType = typeof toArray(args)[0], obj = {}, keys, i;

    if ( argType == "object" )
      obj = args[0];

    if ( argType == "string" ) {
      keys = args[0].split(' ');
      for ( i in keys )
        obj[ keys[i] ] = args[1];
    }

    if ( argType == "function" )
      obj = { '': args[0] };

    return obj;
  }

  function Component(publicInterface,HTML)
  {
    function destroy()
    {
      unmount();
    }

    function gainAnchorElements(elements,anchors)
    {
      for ( var j = 0, attr, attrName, i = elements.length; i--; ) {
        for (; attr = elements[i].attributes[ j++ ]; ) {
          attrName = attr.name
            //dashToCamel
            .replace( /-([a-z])/g, function (g) { return g[1].toUpperCase() });

          anchors[ attrName ] = anchors[ attrName ] || [];
          anchors[ attrName ].push( elements[i] );
        }

        gainAnchorElements( elements[i].children, anchors );
      }
    }

    function mount( parent )
    {
      parent = parent || d.body;

      try {
        for ( var i in elements )
          parent.appendChild( elements[i] );
      }
      catch ( e ) {
        throw "Could not mount component: " + e.message;
      }
    }

    function notifyObservers( propName )
    {
      clearTimeout( notifyTimeoutID[ propName ] );

      notifyTimeoutID[ propName ] = setTO( function() {
        for ( var i in propsObservers[ propName ] )
          propsObservers[ propName ][i]( props[ propName ] );

        if ( propsObservers[''] )
          for ( i in propsObservers[''] )
            propsObservers[''][i]();
      });
    }

    function on()
    {
      var userEventCallbacks = argsToObj( arguments ), eventName;

      for ( eventName in userEventCallbacks ) {
        eventCallbacks[ eventName ] = eventCallbacks[ eventName ] || [];
        eventCallbacks[ eventName ].push( userEventCallbacks[ eventName ] );
      }
    }

    function set()
    {
      var userObj = argsToObj( arguments ), propName;

      for ( propName in userObj ) {
        props[ propName ] = userObj[ propName ];

        notifyObservers( propName );
      }
    }

    function unmount()
    {
      for ( var i in elements )
        elements[i].parentNode &&
          elements[i].parentNode.removeChild( elements[i] );
    }

    var

    component = this,
    elements = [],
    eventCallbacks = {},
    props = {},
    propsObservers = {},
    notifyTimeoutID = {},
    s, d = document, setTO = setTimeout;

    // COMPONENT PROPERTIES
    component.anchors = [];
    component.elements = elements;
    component.props = props;

    // COMPONENT INTERFACE
    component.destroy = destroy;

    component.dispatch=function(eventName){
      var args = toArray( arguments, 1 ), i;

      setTO(function(){
        for ( i in eventCallbacks[ eventName ] )
          eventCallbacks[eventName][i].apply(component.publ,args);
      });
    };

    component.onUpdate=function(){
      var updateCallbacks = argsToObj( arguments ), propName;

      for ( propName in updateCallbacks ) {
        props[ propName ] = props[ propName ] || null;
        propsObservers[propName]=propsObservers[propName]||[];
        propsObservers[propName].push(updateCallbacks[propName]);
        notifyObservers(propName);
      }
    };

    component.mount = mount;
    component.set = set;
    component.unmount = unmount;

    // PUBLIC INTERFACE
    component.publ = publicInterface = publicInterface || {};

    publicInterface.elements = elements;
    publicInterface.destroy = destroy;
    publicInterface.props = props;
    publicInterface.mount = mount;
    publicInterface.on = on;
    publicInterface.set = set;
    publicInterface.unmount = unmount;

    // HTML-> DOM
    if( HTML && d ) {
      s = d.createElement( "div" );
      s.innerHTML = HTML;
      elements = component.elements = component.publ.elements =
        toArray( s.children );
      gainAnchorElements( elements, component.anchors );
    }
  }

  return {
    Component: Component
  }
})
