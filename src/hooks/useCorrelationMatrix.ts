import { useMemo } from 'react'

export interface Cluster {
  indices: number[]
  left?: Cluster
  right?: Cluster
  distance: number
}

function averageLinkage(matrix: number[][], a: Cluster, b: Cluster): number {
  let sum = 0
  let count = 0
  for (const i of a.indices) {
    for (const j of b.indices) {
      if (i === j) continue
      sum += 1 - matrix[i][j]
      count++
    }
  }
  return count ? sum / count : 0
}

export function hierarchicalCluster(matrix: number[][]): Cluster {
  const n = matrix.length
  let clusters: Cluster[] = []
  for (let i = 0; i < n; i++) {
    clusters.push({ indices: [i], distance: 0 })
  }

  while (clusters.length > 1) {
    let min = Infinity
    let pair: [number, number] = [0, 1]
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dist = averageLinkage(matrix, clusters[i], clusters[j])
        if (dist < min) {
          min = dist
          pair = [i, j]
        }
      }
    }
    const [a, b] = pair
    const left = clusters[a]
    const right = clusters[b]
    const merged: Cluster = {
      indices: [...left.indices, ...right.indices],
      left,
      right,
      distance: min,
    }
    clusters = clusters.filter((_, idx) => idx !== a && idx !== b)
    clusters.push(merged)
  }

  return clusters[0]
}

export function clusterOrder(root: Cluster): number[] {
  if (!root.left || !root.right) return root.indices
  return [...clusterOrder(root.left), ...clusterOrder(root.right)]
}

export default function useCorrelationMatrix<T>(
  labels: T[],
  matrix: number[][],
  drilldown?: any[][]
) {
  return useMemo(() => {
    if (!matrix || !matrix.length) {
      return { labels, matrix, drilldown, order: [], tree: null as Cluster | null }
    }
    const tree = hierarchicalCluster(matrix)
    const order = clusterOrder(tree)
    const reorderedLabels = order.map(i => labels[i])
    const reorderedMatrix = order.map(i => order.map(j => matrix[i][j]))
    const reorderedDrilldown = drilldown
      ? order.map(i => order.map(j => drilldown[i][j]))
      : undefined
    return {
      labels: reorderedLabels,
      matrix: reorderedMatrix,
      drilldown: reorderedDrilldown,
      order,
      tree,
    }
  }, [labels, matrix, drilldown])
}

