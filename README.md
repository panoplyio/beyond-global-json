# parse-big

Javascript uses floating numbers to store all numbers. That means that past a certain point (Number.MAX_SAFE_INTEGER), integers will be incorrect due to floating point precision.

parse-big module provides a simple overwrite of the following global JSON object methods, to handle the described above:
* `parse`
* `stringify`

### Usage

```javascript
require( 'parse-big' );
```