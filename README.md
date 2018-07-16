#mesh-patch

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Extract a mesh patch via curvature heuristics.

## Usage

[![NPM](https://nodei.co/npm/mesh-patch.png)](https://www.npmjs.com/package/mesh-patch)

```javascript
var bunny          = require('bunny')
var extractPatch   = require('./index')(bunny.cells, bunny.positions);
var subMesh        = extractPatch(0);
console.log(subMesh) # <- [0, 1, 5, 10...]
```

`require("mesh-patch")(cells, positions)(seedFaceID, [angleThreshold = 5])`
----------------------------------------------------
Returns a function that takes a seed face index and, optionally, a threshold for facet accumulation.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

ISC. See [LICENSE.md](http://github.com/ataber/mesh-simplify/blob/master/LICENSE.md) for details.
