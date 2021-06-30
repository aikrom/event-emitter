import { EventEmitter } from '../src';

describe('EventEmitter', () => {
  it('should create new EventEmitter without crashes', () => {
    const eventEmitter = new EventEmitter([]);
    expect(eventEmitter).toBeInstanceOf(EventEmitter);
  });

  it('should add listener and emit', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const listener = jest.fn();
    eventEmitter.addListener('create', listener);
    eventEmitter.emit('create');
    expect(listener.mock.calls.length).toBe(1);
    expect(eventEmitter.listenerCount('create')).toBe(1);
    expect(eventEmitter.eventNames.length).toBe(1);
  });

  it('should add multiple listers and emit', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const listener = jest.fn();
    const listener2 = jest.fn();
    eventEmitter.addListener('create', listener);
    eventEmitter.addListener('create', listener2);
    eventEmitter.emit('create');
    expect(listener.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(1);
    expect(eventEmitter.listenerCount('create')).toBe(2);
    expect(eventEmitter.eventNames.length).toBe(1);
  });

  it('should emit event multiple times', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const listener = jest.fn();
    const listener2 = jest.fn();
    eventEmitter.addListener('create', listener);
    eventEmitter.addListener('create', listener2);
    eventEmitter.emit('create');
    eventEmitter.emit('create');
    eventEmitter.emit('create');
    expect(listener.mock.calls.length).toBe(3);
    expect(listener2.mock.calls.length).toBe(3);
    expect(eventEmitter.listenerCount('create')).toBe(2);
    expect(eventEmitter.eventNames.length).toBe(1);
  });

  it('should add listeners to different events and emit', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
      update: () => void;
    }>(['create', 'update']);
    const listener = jest.fn();
    eventEmitter.on('create', listener).on('update', listener);
    eventEmitter.emit('create');
    eventEmitter.emit('update');
    expect(listener.mock.calls.length).toBe(2);
    expect(eventEmitter.listenerCount('create')).toBe(1);
    expect(eventEmitter.listenerCount('update')).toBe(1);
    expect(eventEmitter.eventNames.length).toBe(2);
  });

  it('should add one time listener and emit', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const listener = jest.fn();
    eventEmitter.once('create', listener);
    eventEmitter.emit('create');
    eventEmitter.emit('create');
    expect(listener.mock.calls.length).toBe(1);
  });

  it('should throw error the listeners limit has not been reached', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create'], 1, true);
    const listener = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();
    expect(() =>
      eventEmitter
        .on('create', listener)
        .on('create', listener2)
        .on('create', listener3)
    ).toThrow(Error);
  });

  it('should remove all event listeners', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
      update: () => void;
    }>(['create', 'update']);
    const listener = jest.fn();
    eventEmitter.on('create', listener).on('update', listener);
    eventEmitter.removeAllListeners('update');
    expect(eventEmitter.hasListeners('update')).toBeFalsy();
    expect(eventEmitter.hasListeners('create')).toBeTruthy();
  });

  it('should remove all listeners', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
      update: () => void;
    }>(['create', 'update']);
    const listener = jest.fn();
    eventEmitter.on('create', listener).on('update', listener);
    eventEmitter.removeAllListeners();
    expect(eventEmitter.hasListeners('update')).toBeFalsy();
    expect(eventEmitter.hasListeners('create')).toBeFalsy();
  });

  it('should remove listener', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const listener = jest.fn();
    expect(eventEmitter.hasListeners('create')).toBeFalsy();
    eventEmitter.on('create', listener);
    expect(eventEmitter.hasListeners('create')).toBeTruthy();
    eventEmitter.off('create', listener);
    expect(eventEmitter.hasListeners('create')).toBeFalsy();
  });

  it('should work without crashes on remove listener if listener(s) is not defined', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    let listenersCount = 0;
    const listener = jest.fn();
    const listener2 = jest.fn();
    listenersCount = eventEmitter
      .removeListener('create', listener)
      .listenerCount('create');
    expect(listenersCount).toBe(0);
    listenersCount = eventEmitter
      .on('create', listener)
      .listenerCount('create');
    expect(listenersCount).toBe(1);
    listenersCount = eventEmitter
      .removeListener('create', listener2)
      .listenerCount('create');
    expect(listenersCount).toBe(1);
  });

  it('should prepend listener to event listeners map', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const callOrder: number[] = [];
    const listener = jest.fn().mockImplementation(() => callOrder.push(1));
    const listener2 = jest.fn().mockImplementation(() => callOrder.push(2));
    eventEmitter.prependListener('create', listener).emit('create');
    expect(callOrder).toEqual([1]);
    eventEmitter.prependListener('create', listener2).emit('create');
    expect(callOrder).toEqual([1, 2, 1]);
  });

  it('should prepend one listener to event listeners map', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const callOrder: number[] = [];
    const listener = jest.fn().mockImplementation(() => callOrder.push(1));
    const listener2 = jest.fn().mockImplementation(() => callOrder.push(2));
    eventEmitter.prependOnceListener('create', listener).emit('create');
    expect(callOrder).toEqual([1]);
    eventEmitter.prependOnceListener('create', listener2).emit('create');
    expect(callOrder).toEqual([1, 2]);
  });

  it('should return event listeners array', () => {
    const eventEmitter = new EventEmitter<{
      create: () => void;
    }>(['create']);
    const listener = jest.fn();
    const listener2 = jest.fn();
    expect(eventEmitter.listenerCount('create')).toBe(0);
    expect(eventEmitter.listeners('create')).toEqual([]);
    eventEmitter.on('create', listener).on('create', listener2);
    expect(eventEmitter.listeners('create')).toEqual([listener, listener2]);
  });
});
