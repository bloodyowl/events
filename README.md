# events

[![Build Status](https://travis-ci.org/bloodyowl/events.svg)](https://travis-ci.org/bloodyowl/events)

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

### `.on(type, listener[, once])`

Listens to the `type` event with `listener` as callback.
`once` defines whether or not the listener should remove itself afterwards.

chainable, returns `this`

### `.once(type, listener)`

Shortcut for `.listen(type, listener, true)`

chainable, returns `this`

### `.off([type [,listener]])`

If `type` and `listener` are passed, removes the given `listener`.
If only `type` is passed, removes all this type's listeners.
Otherwise, removes all the events listeners.

chainable, returns `this`

### `.emit(type[, args …])`

Triggers synchronously the `type` events, and passes `args…` as arguments for the listeners.

returns `true` if any callback has been executed
returns `false` otherwise

## subclass note

- call `events.constructor.call(this)` in your constructor
- call `events.destructor.call(this)` in your destructor
