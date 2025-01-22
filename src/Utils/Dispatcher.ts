type DispatcherType = {
  _prefix: string
  _listeners: Record<string, Array<unknown>>
  evtName: (evtName: string) => string
  register: <T,>(evtName: string, callback: (evtName: string, params: T) => void, bind?: unknown) => void
  unregister: <T,>(evtName: string, callback: (evtName: string, params: T) => void) => void
  emit: (evtName: string, ...params: unknown[]) => void
}
/**
 * Event Dispatcher
 *
 * Implementation of an event dispatcher following the Mediator pattern
 * @namespace
 */
const Dispatcher: DispatcherType = {
  _prefix: 'on_',
  _listeners: {},
  /**
   * Adds a prefix to the event name
   *
   * Assures that event name doesn't match a standard Object property name
   */
  evtName: function (evtName: string): string {
    return this._prefix + evtName
  },
  /**
   * Registers a callback to an event
   */
  register: function <T>(evtName: string, callback: (evtName: string, params: T) => void, bind?: unknown) {
    const _evtName = this.evtName(evtName)
    if (typeof this._listeners[_evtName] === 'undefined') {
      this._listeners[_evtName] = []
    }
    this._listeners[_evtName].push([!bind ? this : bind, callback])
  },
  /**
   * Unregisters one or all callbacks binded to the given event
   *
   * @param {String} evtName name of the event
   * @param {Function} callback function to unregister. All callbacks if empty
   * @return void
   */
  unregister: function <T>(evtName: string, callback: (evtName: string, params: T) => void) {
    const _evtName = this.evtName(evtName)
    if (typeof callback === 'undefined') {
      delete this._listeners[_evtName]
    } else {
      // splice re-indexes the array, so I'm not declaring `var len`
      // but array length is re-computed at every loop cycle
      for (let i = 0; i < this._listeners[_evtName].length; i++) {
        const listener = this._listeners[_evtName][i] as [unknown, () => void]
        if (listener[1] === callback) {
          this._listeners[_evtName].splice(i, 1)
        }
      }
    }
  },
  /**
   * Emits an event, all registered callbacks are called
   */
  emit: function (evtName: string, ...params: unknown[]) {
    const _evtName = this.evtName(evtName)
    if (typeof this._listeners[_evtName] !== 'undefined') {
      for (let i = 0, l = this._listeners[_evtName].length; i < l; i++) {
        const l = this._listeners[_evtName][i] as [unknown, () => void]
        // @ts-expect-error but it works
        l[1].call(this._listeners[_evtName][i][0], evtName, ...params)
      }
    }
  }
}

export default Dispatcher
