var bunny = require('bunny');
var patch = require('./index.js');
var normals = require('normals');

const extractPatch = patch(bunny.cells, bunny.positions)
const randomPatch = extractPatch(0, 13)
// console.log(randomPatch, bunny.cells[randomPatch[0]], bunny.cells[randomPatch[1]])

var regl = require('regl')();
var mat4 = require('gl-mat4');
var camera = require('regl-camera')(regl, {
  center: [0, 5, 0],
  theta: Math.PI / 2,
  distance: 15
});

var faceNormals = normals.faceNormals(bunny.cells, bunny.positions)
var explodedPositions = [];
var perVertexFaceNormals = [];
var color = [];
bunny.cells.map(function(cell, i) {
  explodedPositions.push(bunny.positions[cell[0]]);
  explodedPositions.push(bunny.positions[cell[1]]);
  explodedPositions.push(bunny.positions[cell[2]]);
  perVertexFaceNormals.push(faceNormals[i]);
  perVertexFaceNormals.push(faceNormals[i]);
  perVertexFaceNormals.push(faceNormals[i]);
  const c = randomPatch.indexOf(i) === -1 ? [0.25, 0.25, 0.25] : [0.15, 0.15, 0.85]
  color.push(c)
  color.push(c)
  color.push(c)
});

var drawBunny = regl({
  vert: `
  precision mediump float;
  attribute vec3 position, normal, color;
  varying vec3 vNorm, vColor;
  uniform mat4 projection;
  uniform mat4 view;
  void main() {
    vNorm = normal;
    vColor = color;
    gl_Position = projection * view * vec4(position, 1.0);
  }
  `
  , frag: `
  precision mediump float;
  varying vec3 vNorm, vColor;
  void main() {
    vec3 lightDir = normalize(vec3(1.0, 0.5, 0.));
    vec3 shaded = vec3(0.3) * dot(vNorm, lightDir) + vColor;
    gl_FragColor = vec4(shaded, 1.0);
  }
  `,
  attributes: {
    position: explodedPositions,
    normal: perVertexFaceNormals,
    color: color
  },
  count: bunny.cells.length * 3,
  primitive: 'triangles'
})

regl.frame(() => {
  regl.clear({
    color: [1, 1, 1, 1],
    depth: 1
  })

  camera(() => {
    drawBunny({
      view: mat4.create()
    })
  })
})
