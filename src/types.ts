/**
 * Event-Emitter listener function.
 */
export type Listener = (...args: any[]) => Promise<any> | void;
/**
 * Event-Emitter listeners are mapped to `keyof EventMap` as keys.
 * @template T - Event listener map.
 */
export type ListenersMap<T> = Record<keyof T, Listener[]>;
/**
 * Event-Emitter default events map.
 */
export type DefaultEventMap = { [event in string | symbol]: Listener };

/**
 * Event-Emitter
 *
 * @template TMap - Events `keys` and `listeners` map.
 */
export interface IEventEmitter<TMap extends DefaultEventMap = DefaultEventMap> {
  /**
   * Events names/keys.
   */
  eventNames: Array<keyof TMap>;

  /**
   * Max count of listeners.
   */
  maxListeners: number;

  /**
   * Calls all event listeners with args.
   */
  emit<TKey extends keyof TMap>(
    event: TKey,
    ...args: Parameters<TMap[TKey]>
  ): boolean;

  /**
   * Checks if event listeners exist.
   * @param event - Event key/name.
   * @template TKey - Events map key (Event name).
   */
  hasListeners<TKey extends keyof TMap = string>(event: TKey): boolean;

  /**
   * Checks that the listeners limit has not been reached.
   * @param event - Event key/name.
   * @template TKey - Events map key (Event name).
   */
  checkListenersLimit<TKey extends keyof TMap = string>(event: TKey): boolean;

  /**
   * Adds a listener to the listener map.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Events map key (Event name).
   */
  addListener<EventKey extends keyof TMap = string>(
    event: EventKey,
    fn: TMap[EventKey]
  ): this;

  /**
   * Removes a listener from the listener map.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Event map key (Event name).
   */
  removeListener<TKey extends keyof TMap = string>(
    event: TKey,
    fn: TMap[TKey]
  ): this;

  /**
   * Removes all listeners of a specific event type (key, name) or clears the listener map.
   * @param [event] - Event key/name.
   * @template TKey - Event map key (Event name).
   */
  removeAllListeners<TKey extends keyof TMap = string>(event?: TKey): this;

  /**
   * Adds a listener to the listener map.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Event map key (Event name).
   */
  on<TKey extends keyof TMap = string>(event: TKey, fn: TMap[TKey]): this;

  /**
   * Removes a listener from the listener map.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Event map key (Event name).
   */
  off<TKey extends keyof TMap = string>(event: TKey, fn: TMap[TKey]): this;

  /**
   * Adds a listener to the listener map that runs only once.
   * The listener function will be removed after the first call.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Event map key (Event name).
   */
  once<TKey extends keyof TMap = string>(event: TKey, fn: TMap[TKey]): this;

  /**
   * Adds a listener to the beginning of the listener map.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Event map key (Event name).
   */
  prependListener<TKey extends keyof TMap = string>(
    event: TKey,
    fn: TMap[TKey]
  ): this;

  /**
   * Adds a listener to the beginning of the listener map, which runs only once.
   * The listener function will be removed after the first call.
   * @param event - Event key/name.
   * @param fn - Event listener function.
   * @template TKey - Event map key (Event name).
   */
  prependOnceListener<TKey extends keyof TMap = string>(
    event: TKey,
    fn: TMap[TKey]
  ): this;

  /**
   * Provides an array of listeners of a specific event type (key, name).
   * @param event - Event key/name.
   * @template TKey - Event map key (Event name).
   */
  listeners<TKey extends keyof TMap = string>(event: TKey): TMap[TKey][];

  /**
   * Gives the number of listeners of a particular  event type.
   * @param event - Event key/name.
   * @template TKey - Event map key (Event name).
   */
  listenerCount<TKey extends keyof TMap = string>(event: TKey): number;
}
