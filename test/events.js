var tape = require("tape")
  , events = require("..")

tape("events", function(test){
  
  test.plan(3)

  var eventClass = events.create()
    , i = ""
  
  eventClass.listen("foo", function(param1, param2){
    test.equal(param1, "bar", "passes information")
    test.equal(param2, "baz", "passes information (multiple arguments)")
    test.equal(i, "1", "runs asynchronously")
  })
  
  eventClass.fire("foo", "bar", "baz")
  i += "1"

})

tape("events, execution order", function(test){

  test.plan(3)

  var eventClass = events.create()

  eventClass.listen("foo", function(obj){
    test.equal(obj.foo, 0, "passes object")
    ;++obj.foo
  })
  eventClass.listen("foo", function(obj){
    test.equal(obj.foo, 1, "passes object")
    ;++obj.foo
  })
  eventClass.listen("foo", function(obj){
    test.equal(obj.foo, 2, "passes object")
    ;++obj.foo
  })

  eventClass.fire("foo", {foo:0})

})


tape("events, listenOnce", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  eventClass.listenOnce("foo", function(){
    test.ok(++i < 1)
    eventClass.fire("foo")
  })

  eventClass.fire("foo")

})

tape("events, listenOnce removal", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  function fail(){
    ++i
    test.fail()
  }
  eventClass.listenOnce("foo", fail)

  eventClass.stopListening("foo", fail)
  eventClass.fire("foo")
  
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
    eventClass.stopListening(callback)
  }
  eventClass.listen("foo", callback)
  eventClass.listen("foo", callback)

  eventClass.fire("foo", "bar", "baz")

})


tape("events, stop listening", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  function callback(param1, param2){
    test.ok(++i < 1, "stops listening with listener reference")
    eventClass.stopListening("foo", callback)
  }
  eventClass.listen("foo", callback)
  
  eventClass.fire("foo", "bar", "baz")

})


tape("events, stop listening", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1
  
  eventClass.listen("foo", function(){++i;test.fail()})
  eventClass.listen("foo", function(){++i;test.fail()})
  eventClass.stopListening("foo")

  eventClass.fire("foo")
  setTimeout(function(){
    test.equal(i, -1, "stops listening all listeners")
  }, 100)
})


tape("events, stop listening all events", function(test){

  test.plan(1)

  var eventClass = events.create()
    , i = -1

  eventClass.listen("foo", function(){++i;test.fail()})
  eventClass.listen("bar", function(){++i;test.fail()})
  eventClass.stopListening()

  eventClass.fire("foo")
  eventClass.fire("bar")
  
  setTimeout(function(){
    test.equal(i, -1, "stops listening all events")
  }, 100)
})
