var tape = require("tape")
  , events = require("..")

tape("events", function(test){

  test.plan(3)

  var eventClass = events.create()
    , i = ""

  test.equal(eventClass.on("foo", function(param1, param2){
    test.equal(param1, "bar", "passes information")
    test.equal(param2, "baz", "passes information (multiple arguments)")
  }), eventClass)

  eventClass.emit("foo", "bar", "baz")
  i += "1"

})

tape("events, execution order", function(test){

  test.plan(3)

  var eventClass = events.create()

  eventClass.on("foo", function(obj){
    test.equal(obj.foo, 0, "passes object")
    ;++obj.foo
  })
  eventClass.on("foo", function(obj){
    test.equal(obj.foo, 1, "passes object")
    ;++obj.foo
  })
  eventClass.on("foo", function(obj){
    test.equal(obj.foo, 2, "passes object")
    ;++obj.foo
  })

  eventClass.emit("foo", {foo:0})

})


tape("events, once", function(test){

  test.plan(2)

  var eventClass = events.create()
    , i = -1

  test.equal(eventClass.once("foo", function(){
    test.ok(++i < 1)
    eventClass.emit("foo")
  }), eventClass)

  eventClass.emit("foo")

})

tape("events, once removal", function(test){

  test.plan(2)

  var eventClass = events.create()
    , i = -1

  function fail(){
    ++i
    test.fail()
  }
  eventClass.once("foo", fail)

  test.equal(eventClass.off("foo", fail), eventClass)
  eventClass.emit("foo")

  setTimeout(function(){
    test.equal(i, -1, "removed listenedOnce before being executed")
  }, 300)

})

tape("events, listener duplication", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  function callback(param1, param2){
    test.ok(++i < 1, "prevents listener duplication")
    eventClass.off(callback)
  }
  eventClass.on("foo", callback)
  eventClass.on("foo", callback)

  eventClass.emit("foo", "bar", "baz")

})


tape("events, off", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  function callback(param1, param2){
    test.ok(++i < 1, "stops listening with listener reference")
    eventClass.off("foo", callback)
  }
  eventClass.on("foo", callback)

  eventClass.emit("foo", "bar", "baz")

})


tape("events, off", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  eventClass.on("foo", function(){++i;test.fail()})
  eventClass.on("foo", function(){++i;test.fail()})
  eventClass.off("foo")

  eventClass.emit("foo")
  setTimeout(function(){
    test.equal(i, -1, "stops listening all listeners")
  }, 100)
})


tape("events, stop listening all events", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  eventClass.on("foo", function(){++i;test.fail()})
  eventClass.on("bar", function(){++i;test.fail()})
  eventClass.off()

  eventClass.emit("foo")
  eventClass.emit("bar")

  setTimeout(function(){
    test.equal(i, -1, "stops listening all events")
  }, 100)
})


tape("emit", function(test){
  var eventClass = events.create()
    , isSync = false
  eventClass.emit("foo", 4)
  eventClass.on("foo", function(value){
    test.equal(value, 1, "passes values to listener")
    isSync = true
  })
  test.equal(eventClass.emit("foo", 1), true, "returns true if had handlers")
  test.equal(eventClass.emit("bar", 1), false, "returns false if had no handlers")
  test.ok(isSync, "is synchronous")
  test.end()
})
