var klass = require("bloody-class")
  , immediate = require("bloody-immediate")
  , _slice = [].slice

module.exports = klass.extend({
  constructor : function(){
    this._events = {}
  },
  destructor : function(){
    this._events = {}
  },
  listen : function(type, listener, once){
    var listeners = this._events[type] || (this._events[type] = [])
      , index = -1, length = listeners.length, fn
      , self = this
    while(++index < length) {
      if(listeners[index] === listener) {
        return
      }
    }
    if(once) {
      fn = function(){
        self.stopListening(type, listener)
        return listener.apply(null, arguments)
      }
      fn.listener = listener
    }
    listeners.push(fn || listener)
  },
  listenOnce : function(type, listener){
    this.listen(type, listener, true)
  },
  stopListening: function(type, listener){
    var listeners, length
    switch (arguments.length) {
      case 0:
        this.destructor()
      case 1:
        this._events[type] = null
      default:
        listeners = this._events[type]
        length = listeners && listeners.length
        if(!length) return
        while(--length > -1) {
          if(listeners[length] === listener || listeners[length].listener === listener) {
            listeners.splice(length, 1)
            break
          }
        }
    }
  },
  fire : function(type){
    var listeners = this._events[type]
      , length = listeners && listeners.length
      , args, index = -1
    if(!length) return
    args = _slice.call(arguments, 1)
    immediate.call(runner)
    function runner(){
      if(++index >= length) return
      listeners[index].apply(null, args)
      immediate.call(runner)
    }
  }
})
