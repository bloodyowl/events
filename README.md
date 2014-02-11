# events

[![browser support](https://ci.testling.com/bloodyowl/events.png)](https://ci.testling.com/bloodyowl/events)

## install 

```
$ npm install bloody-events
```

## require 

```javascript
var events = require("bloody-events")
```

## API

### `.create() -> events`

Creates an event object

### `.extend(object) -> events subclass`

Creates an event-object subclass 

### `.listen(type, listener[, once])`

Listens to the `type` event with `listener` as callback. 
`once` defines whether or not the listener should remove itself afterwards. 

### `.listenOnce(type, listener)`

Shortcut for `.listen(type, listener, true)`

### `.stopListening([type [,listener]])`

If `type` and `listener` are passed, removes the given `listener`. 
If only `type` is passed, removes all this type's listeners. 
Otherwise, removes all the events listeners. 

### `.fire(type[, args …])`

Triggers the `type` events, and passes `args…` as arguments for the listeners. 
