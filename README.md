Deep Object
===========

Creates a infinite deep object.

This micro library was inspired by the [WIP Optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) in Javascript.

How to use
==========

Usage
-----

`DeepObject` Constructor allows you chain properties, even if not defined, avoiding `Uncaught TypeError` for undefined properties.

```javascript
var obj = DeepObject();

// Allows to read and set properties freely.
obj.level1.level2.level3 = { name: 'level 3' };
```

When a __deep property__ is set, its path is also defined in the main object.

```javascript

obj { level1: { level2: { level3: { name: 'level 3' } } } }
```

Initializiation
---------------

```javascript
/**
 * Creates a new empty deep object.
 */
var obj = DeepObject();
```

```javascript
/**
 * Creates a new deep object with a value.
 */
var obj = DeepObject(10);

obj.one.two.three = 3;

obj + obj.one.two.three === 13 // Expected output: true
```

```javascript
/**
 * Creates a deep object with default values.
 */

var obj = DeepObject({
    height: 10,
    data: {
        reference: 1001,
        location: {
            locale: 'es-MX',
        },
    },
});

obj.data.location.locale == 'es-MX'; // Expected output: true
obj.data.location.locale.newExt.otherData.ColimaCity.Colimita = 'Ticus'; // Still a DeepObject.

```

Casting & Comparation
---------------------

A `DeepObject` is an `Object` after all. So casting it directly as a `Boolean` will produce a `truly`
value. To check its raw value, you can use the `built-in` function `valueOf`, that result can be safely evaluated.

```javascript
var obj = DeepObject();

obj ? 1 : 0 // Expected value: 1.
if (obj) { true } else { false } // Expected value: true.
!!obj // Expected value: true.
Boolean(obj) // Expected value: true.

obj.valueOf() // Expected output: null (Since no default value was specified in the constructor).
```

In the other hand, a `DeepObject` can be loosely compared using the `==` operator.


```javascript
var str = DeepObject('Hola');

str == 'Hola' // Expected value: true.

str.toUpperCase() === 'HOLA' // Expected output: true (This can be strictly compared because `toUpperCase` method returns a native string).
```

```javascript
var str = DeepObject(false);

str == false // Expected value: true.
```

```javascript
var int = DeepObject(9);

int < 10 // Expected value: true.

int.toFixed(2) === '9.00' // Expected output: true (This can be strictly compared because `toUpperCase` method returns a native string).
```

Functions
---------

Can be used as a value for a `Deep Object`.

```javascript
var obj = DeepObject(() => 2);

obj.valueOf()() // Expected value: 2. Needs `valueOf` to be casted since its default value is a function.

obj.someBlock.otherLevel = () => 3;

obj.valueOf()() + obj.someBlock.otherLevel.valueOf()() // Expected value: 5
```

Object literal representation
-----------------------------

__NOTE__: Avoid using `JSON.stringify` method directly with a `Deep Object`. Since its infinite, it will cause a recursion error.

To get a native `Object literal {}`, use the method `getLiteral`. This can be safely use in `JSON` methods.

The property `value` contains the value of a node from a `DeepObject`. Its children are defined as key-value pair.

```javascript
const obj = DeepObject(10);

obj.five = 5;
obj.five.fivedotnine = 9.5;
obj.six = 'six';
obj.sixdotone = 'six.one';

obj.getLiteral(); /* Expected value:
{
    value:10,
    five:{
        value:5,
        fivedotnine:{
            value: 9.5
        }
    },
    six:{
        value: "six"
    },
    sixdotone:{
        value: "six.one"
    }
}
*/
```

__NOTE__: Casting `obj.emptyLevel.emptyLevel2.emptyLevel3` in a `DeepObject`, will also define its path in its Object literal representation.


Reserved properties
-------------------

For this to work correclty, avoid overiding the following properties:

- `getLiteral`
- `_getLiteral`
- `setValue`
- `valueOf`
- `__raw__`
- `Symbol.toPrimitive`


Author
======

Francisco Javier Vega Barbosa javimalak@gmail.com


Bugs
----

To report a bug, use <a target="_blank" href="https://github.com/JVegaB/DeepObject/issues">this issues page.</a>
