var klass = require("bloody-class")
var handleEventTypes = {
  "object" : 1,
  "function" : 1
}

module.exports = klass.extend({
  constructor : function(){
    this.store = {}
  },
  destructor : function(){
    this.store = {}
  },
  getTypeStore : function(type){
    if(this.store[type]) {
      return this.store[type]
    }
    return this.store[type] = []
  },
  indexOf : function(type, listener){
    var index = -1
    var store = this.getTypeStore(type)
    var length = store.length
    var item
    while(++index < length) {
      item = store[index]
      if(listener.listener == item.listener) {
        return index
      }
    }
    return -1
  },
  has : function(type, listener){
    return this.indexOf(type, listener) != -1
  },
  push : function(type, listener, once){
    var normalised = this.normalise(listener, once)
    if(this.has(type, normalised)) {
      return
    }
    this.getTypeStore(type).push(normalised)
  },
  remove : function(type, listener){
    var normalised
    var index
    if(arguments.length == 0) {
      this.destroy()
      return
    }
    if(arguments.length == 1) {
      this.getTypeStore(type).length = 0
      return
    }
    normalised = this.normalise(listener)
    index = this.indexOf(type, normalised)
    if(index == -1){
      return
    }
    this.getTypeStore(type).splice(index, 1)
  },
  loop : function(type, args){
    var store = this.getTypeStore(type)
    var index = -1
    var length = store.length
    var toRemove = []
    var listener
    var ran = false
    while(++index < length) {
      listener = store[index]
      if(--listener.remaining < 0) {
        toRemove.push(index)
        continue
      }
      if(typeof listener.callback == "object") {
        if(typeof listener.callback[type] == "function") {
          listener.callback[type].apply(listener.thisValue, args)
          ran = true
        }
      } else {
        listener.callback.apply(listener.thisValue, args)
        ran = true
      }
    }
    while(index = toRemove.pop()) {
      store.splice(index, 1)
    }
    return ran
  },
  normalise : function(listener){
    var callback
    var handleEvent
    var representation
    if(typeof listener == "function") {
      callback = listener
    }
    if(listener != null) {
      handleEvent = listener.handleEvent
      if(handleEvent != null && handleEventTypes[typeof handleEvent]) {
        callback = listener.handleEvent
      }
    }
    return {
      listener : listener,
      callback : callback,
      thisValue : callback == listener ? null : listener,
      remaining : arguments[1] ? 1 : Infinity
    }
  }
})
