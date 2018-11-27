const complex = require('simplicial-complex')
const triangleNormal = require('triangle-normal')
const vec3 = require('gl-vec3')

module.exports = function (cells, positions) {
  const edges = complex.unique(complex.skeleton(cells, 1))
  const edgeToCellIncidence = complex.incidence(edges, cells)
  const vertexToCellIncidence = complex.dual(cells)

  function computeDihedralAngle(cell1, cell2) {
    const normals = [cell1, cell2].map(function(cell) {
      const vertices = [
        positions[cell[0]],
        positions[cell[1]],
        positions[cell[2]]
      ]
      const normal = [0, 0, 0]
      triangleNormal(
        vertices[0][0],
        vertices[0][1],
        vertices[0][2],
        vertices[1][0],
        vertices[1][1],
        vertices[1][2],
        vertices[2][0],
        vertices[2][1],
        vertices[2][2],
        normal
      )
      return normal
    })

    return Math.acos(vec3.dot(normals[0], normals[1])) * 180 / Math.PI
  }

  return function(seedFaceId, angleThreshold = 5) {
    const stack = []
    const faceIds = []
    const visited = new Array(cells.length).fill(false)

    stack.push(seedFaceId)

    while (stack.length > 0) {
      const curFID = stack.pop()
      if (curFID == null || curFID < 0) {
        break
      }

      if (visited[curFID]) {
        continue
      }

      visited[curFID] = true
      faceIds.push(curFID)

      const currentCell = cells[curFID]
      for (let vid = 0; vid < 3; vid++) {
        const edge = [currentCell[vid], currentCell[(vid + 1) % 3]]
        const edgeIndex = complex.findCell(edges, edge)
        if (edgeIndex === -1) {
          throw "Unexpected missing edge!"
        }

        const incidentCells = edgeToCellIncidence[edgeIndex]
        incidentCells.map(function(cellIndex) {
          // find the incident cell that is not the original cell we're considering
          if (cellIndex === curFID) {
            return
          }

          const incidentCell = cells[cellIndex]
          let angle = Math.abs(computeDihedralAngle(currentCell, incidentCell))
          angle = angle > 90 ? 180 - angle : angle
          if (angle <= angleThreshold) {
            stack.push(cellIndex)
          }
        })
      }
    }

    return faceIds
  }
}
