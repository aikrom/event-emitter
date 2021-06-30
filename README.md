# Tiny Event Emitter

Tiny Typed Event Emitter implemented with typed args, based on nodejs EventEmitter (inspired by [tsee](https://github.com/Morglod/tsee)).

## Install

To install package, use:

```bash
npm install @aintts/event-emitter
```

## Simple usage

```js
import { EventEmitter } from '@aintts/event-emitter';

const events = new EventEmitter<{
    hello: (msg: string) => void,
}>();

// arguments is fully type checked
events.emit('hello', 'hello world');

```

---------

[MIT Licensed](./LICENSE)