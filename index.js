var klass = require("bloody-class")
var store = require("./lib/store")
var slice = [].slice

module.exports = klass.extend({
  constructor : function(){
    this._events = store.create()
  },
  destructor : function(){
    this._events.destroy()
  },
  on : function(type, listener){
    this._events.push(type, listener)
    return this
  },
  once : function(type, listener){
    this._events.push(type, listener, true)
    return this
  },
  off : function(){
    this._events.remove.apply(this._events, arguments)
    return this
  },
  emit : function(type){
    return this._events.loop(type, slice.call(arguments, 1))
  }
})
