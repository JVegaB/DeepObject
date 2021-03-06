
window.DeepObject = (function () {
    // Symbols for the privated properties in a `ProxyValue`.
    const SYMBOLS = {
        isProxyValue: Symbol('Identify an object as ProxyValue'),
        raw: Symbol('Raw value of a ProxyValue'),
        register: Symbol('Register a value in the literal representation of a ProxyValue'),
    };
    // This properties are set rawly.
    const rawSetters = [ SYMBOLS.raw ];
    // This properties cannot be writen.
    const privateSetters = [ 'getLiteral', 'setValue', 'valueOf', SYMBOLS.isProxyValue, Symbol.toPrimitive ];
    // Properties obviated by the proxy.
    const specialProperties = rawSetters.concat(privateSetters);
    /**
     * Wrapper to use a value, no matter its type.
     * @param {any} raw: Value that represent this `ProxyValue`. 
     */
    function ProxyValue (raw) {
        let that = this;
        // If the raw value its a function, its properties will be modified instead of this.
        if (typeof raw == 'function') {
            that = raw;
        }
        //This property stores the ray value.
        that[SYMBOLS.raw] = raw;
        // Sets the prototype of the raw value to this, so all the methods can be used.
        Object.setPrototypeOf(that, Object.getPrototypeOf(that[SYMBOLS.raw] || {}))
        // Identify this object as a proxy.
        that[SYMBOLS.isProxyValue] = true;
        // Stores the childs without triggering the proxy.
        const literal = {};
        // Getter of the raw value.
        that.valueOf = function () { return this[SYMBOLS.raw] };
        // Setter of the raw value.
        that.setValue = function (value) { this[SYMBOLS.raw] = value };
        // Returns an object literal that represent this PrixyValue.
        that.getLiteral = function () {
            const doppelganger = { value: raw };
            for (let prop in literal) {
                const value = this[prop];
                doppelganger[prop] = value[SYMBOLS.isProxyValue] ? value.getLiteral() : value;
            }
            return doppelganger;
        };
        // Exposes the `literal` variable, so can be edited by reference outside this namespace.
        that[SYMBOLS.register] = function (key, value) { return literal[key] = value };
        // If the raw value its a function, we need to return that function.
        if (typeof raw == 'function') {
            return raw;
        }
    };
    /**
      * Creates an object that can be accessed deeply without throwing and Exception for null or
      * undefined values.
      *
      * @param {any} object: Initial value for the Deep Object. The default value is `null`.
      */
    function ProxyContainer (object) {
        const proxy = new Proxy (new ProxyValue(typeof object == 'object' ? null : object), {
            get: function (target, property) {
                const prop = target[property];
                // Raw value's prototype functions are returned with its raw value as `this`.
                if (typeof prop == 'function' && !privateSetters.includes(property))
                    return prop.bind(target.valueOf());
                // Existing Proxies and special properties are returned rawly.
                if (specialProperties.includes(property) || (prop && prop[SYMBOLS.isProxyValue]))
                    return prop;
                // Read only properties are returned rawly.
                // This node is not a `DeepObject`.
                const descriptors = Object.getOwnPropertyDescriptor(target, property);
                if (descriptors && !descriptors.writable) {
                    return prop;
                }
                // New properties are registered as a new Proxy and returned.
                return target[property] = target[SYMBOLS.register](property, ProxyContainer());
            },
            set: function (target, property, value) {
                // Private setters cannot be modified.
                if (privateSetters.includes(property))
                    return false;
                // Read only properties are not set.
                const descriptors = Object.getOwnPropertyDescriptor(target, property);
                if (descriptors && !descriptors.writable) {
                    return false;
                }
                // Protected setters are set as a raw value.
                if (rawSetters.includes(property))
                    return target[property] = value;
                // register the `ProxyValue`'s object literal.
                target[SYMBOLS.register](property, value);
                // To avoid overriding childs, if exists, update its raw value.
                if (property in target)
                    target[property].setValue(value)
                else
                    target[property] = ProxyContainer(value);
            },
            construct: function (target, args) {
                return new target(...args);
            }
        });
        // Sets the default data defined in the constructor.
        if (typeof object == 'object') for (let addon in object) proxy[addon] = object[addon];
        // Any instantiation of this function will return a `Proxy` object.
        return proxy;
    }
    return ProxyContainer;
}) ();
