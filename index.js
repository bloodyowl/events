var klass = require("bloody-class")
var immediate = require("bloody-immediate")
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
        return
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
  },
  once : function(type, listener){
    this.on(type, listener, true)
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
  },
  emit : function(type){
    var listeners = this._events[type]
    var length = listeners && listeners.length
    var args, index = -1
    if(!length) return
    args = _slice.call(arguments, 1)
    immediate.call(runner)
    function runner(){
      if(++index >= length) return
      immediate.call(runner)
      listeners[index].apply(null, args)
    }
  },
  emitSync : function(type){
    var listeners = this._events[type]
    var length = listeners && listeners.length
    var args, index = -1
    if(!length) return
    args = _slice.call(arguments, 1)
    runner()
    function runner(){
      if(++index >= length) return
      listeners[index].apply(null, args)
      runner()
    }
  }
})
