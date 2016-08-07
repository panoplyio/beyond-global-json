# beyond-global-json

Javascript uses floating numbers to store all numbers. That means that past a certain point (Number.MAX_SAFE_INTEGER), integers will be incorrect due to floating point precision.

beyond-global-json module provides a simple override of the following global JSON object methods, to handle the described above:
* `parse`
* `stringify`

### Usage

```javascript
require( 'beyond-global-json' );
```
