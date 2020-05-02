
window.DeepObject = (function () {

    // Since cannot use `instanceof` in `Proxy` like elements.
    var isProxyValue = Symbol('Symbol for proxy value');

    /**
     * Wrapper to use a value, no matter its type.
     * @param {any} raw Raw value. 
     */
    function ProxyValue (raw) {
        // Identify this object as a proxy.
        this[isProxyValue] = true;

        var literal = {};
        this.__raw__ = raw === undefined ? null : raw;
        Object.setPrototypeOf(this, Object.getPrototypeOf(this.__raw__ || {}))

        /**
         * This object evaluates as `null` if no `__raw__` property set.
         */
        this.valueOf = this[Symbol.toPrimitive] = function () {
            return this.__raw__ === undefined ? null : this.__raw__;
        };

        /**
         * Only exposure to edit the value stored in the Object.
         */
        this.setValue = function (value) {
            this.__raw__ = value === undefined ? null : value;
        };

        this.getLiteral = function () {
            var doppelganger = {
                value: raw,
            };
            for (let prop in literal) {
                var value = this[prop];
                if (value[isProxyValue]) {
                    doppelganger[prop] = value.getLiteral();
                } else {
                    doppelganger[prop] = value;
                }
            }
            return doppelganger;
        };

        this._getLiteral = function () {
            return literal;
        };
    };

    /**
     * Properties obviated by the proxy.
     */
    var protectedProps = ['getLiteral', '_getLiteral', 'setValue', 'valueOf', '__raw__', Symbol.toPrimitive, isProxyValue];

    /**
      * Creates an object that can be accessed deeply without throwing and Exception for null or
      * undefined values.
      *
      * @param {any} object: Initial value for the Deep Object. The default value is `null`.
      */
    function ProxyContainer (object) {

        var nativeObject =  typeof object == 'object' ? null : object;
        var proxyValue = new ProxyValue(nativeObject);

        var proxy = new Proxy (proxyValue, {

            get: function (target, property) {
                var prop = target[property];
                if (typeof prop == 'function' && !protectedProps.includes(property)) {
                    return prop.bind(target.valueOf());
                };
                if (protectedProps.includes(property) || prop != null || typeof prop == 'function') {
                    return prop;
                };
                return target[property] = target._getLiteral()[property] = ProxyContainer();
            },

            set: function (target, property, value) {
                target._getLiteral()[property] = value;
                if (protectedProps.includes(property)) {
                    return target[property] = value;
                }
                if (property in target) {
                    target[property].setValue(value);
                } else {
                    target[property] = ProxyContainer(value);
                }
            }
        });

        if (typeof object == 'object') for (let addon in object) {
            proxy[addon] = object[addon];
        }

        return proxy;
    }

    return ProxyContainer;
}) ();

