import { DefaultEventMap, IEventEmitter, ListenersMap } from './types';

/**
 * Event-Emitter
 *
 * @template TMap - Events `keys` and `listeners` map.
 */
export class EventEmitter<TMap extends DefaultEventMap = DefaultEventMap>
  implements IEventEmitter<TMap> {
  private eventListeners = {} as ListenersMap<TMap>;

  /**
   * @constructor
   * @param maxListeners - Max listeners count (Infinite by default).
   * @param _throwLimitError - Throw error if max listeners is added.
   */
  constructor(
    public readonly eventNames: Array<keyof TMap>,
    public readonly maxListeners = Infinity,
    private readonly throwLimitError = false
  ) {}

  public hasListeners<TKey extends keyof TMap = string>(event: TKey) {
    return this.eventListeners[event] && !!this.eventListeners[event].length;
  }

  public checkListenersLimit<TKey extends keyof TMap>(event: TKey) {
    const inLimit =
      this.maxListeners !== Infinity &&
      this.maxListeners === this.eventListeners[event].length;

    if (this.throwLimitError && !inLimit) {
      throw new Error(`Maximum event listeners for "${event}" event!`);
    }

    return inLimit;
  }

  public emit<TKey extends keyof TMap>(
    event: TKey,
    ...args: Parameters<TMap[TKey]>
  ) {
    this.eventListeners[event].forEach(listener => {
      listener(...args);
    });

    return this.hasListeners(event);
  }

  public addListener<TKey extends keyof TMap = string>(
    event: TKey,
    listener: TMap[TKey]
  ) {
    if (!this.hasListeners(event)) {
      this.eventListeners[event] = [];
    }

    this.checkListenersLimit(event);
    this.eventListeners[event].push(listener);

    return this;
  }

  public removeListener<TKey extends keyof TMap = string>(
    event: TKey,
    listener: TMap[TKey]
  ) {
    if (this.hasListeners(event)) {
      const listenerIndex = this.eventListeners[event].indexOf(listener);

      if (listenerIndex !== -1) {
        this.eventListeners[event].splice(listenerIndex, 1);
      }
    }

    return this;
  }

  public removeAllListeners<TKey extends keyof TMap = string>(event?: TKey) {
    if (event) {
      delete this.eventListeners[event];
    } else {
      this.eventListeners = {} as ListenersMap<TMap>;
    }

    return this;
  }

  public on<TKey extends keyof TMap = string>(
    event: TKey,
    listener: TMap[TKey]
  ) {
    this.addListener(event, listener);
    return this;
  }

  public off<TKey extends keyof TMap = string>(
    event: TKey,
    listener: TMap[TKey]
  ) {
    return this.removeListener(event, listener);
  }

  public once<EventKey extends keyof TMap = string>(
    event: EventKey,
    listener: TMap[EventKey]
  ) {
    const onceListener = ((...args: any) => {
      listener(...args);
      this.removeListener(event, onceListener);
    }) as any;

    this.addListener(event, onceListener);
    return this;
  }

  public prependListener<TKey extends keyof TMap = string>(
    event: TKey,
    listener: TMap[TKey]
  ) {
    this.checkListenersLimit(event);

    if (!this.hasListeners(event)) {
      this.eventListeners[event] = [listener];
    } else {
      this.eventListeners[event].unshift(listener);
    }

    return this;
  }

  prependOnceListener = <TKey extends keyof TMap = string>(
    event: TKey,
    listener: TMap[TKey]
  ): this => {
    const onceListener = ((...args: any) => {
      listener(...args);
      this.removeListener(event, onceListener);
    }) as any;

    this.prependListener(event, onceListener);
    return this;
  };

  listeners = <TKey extends keyof TMap = string>(event: TKey): TMap[TKey][] => {
    return this.hasListeners(event)
      ? ([...this.eventListeners[event]] as any[])
      : [];
  };

  listenerCount = <TKey extends keyof TMap = string>(event: TKey): number => {
    return (
      (this.eventListeners[event] && this.eventListeners[event].length) || 0
    );
  };
}
