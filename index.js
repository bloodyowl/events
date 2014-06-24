var klass = require("bloody-class")
var _slice = [].slice

module.exports = klass.extend({
  constructor : function(){
    this._events = {}
  },
  destructor : function(){
    this._events = {}
  },
  on : function(type, listener, once){
    var listeners = this._events[type] || (this._events[type] = [])
    var index = -1, length = listeners.length, fn
    var self = this
    while(++index < length) {
      if(listeners[index] === listener) {
        return this
      }
    }
    if(once) {
      fn = function(){
        self.off(type, listener)
        return listener.apply(null, arguments)
      }
      fn.listener = listener
    }
    listeners.push(fn || listener)
    return this
  },
  once : function(type, listener){
    this.on(type, listener, true)
    return this
  },
  off: function(type, listener){
    var listeners
    var length
    switch (arguments.length) {
      case 0:
        this._events = {}
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
    return this
  },
  emit : function(type){
    var listeners = this._events[type]
    var length
    var args = _slice.call(arguments, 1)
    var index = -1
    if(!listeners) {
      return false
    }
    listeners = listeners.concat()
    length = listeners.length
    if(!length) {
      return false
    }
    while(++index < length) {
      listeners[index].apply(null, args)
    }
    return true
  }
})
