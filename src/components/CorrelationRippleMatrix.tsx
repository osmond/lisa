import useCorrelationMatrix, { Cluster, clusterOrder } from '../hooks/useCorrelationMatrix.ts'

interface Props {
  labels: string[]
  matrix: number[][]
  drilldown?: any[][]
  showDendrogram?: boolean
}

type Orientation = 'top' | 'left'

function Dendrogram({ tree, orientation = 'top', size = 20 }: { tree: Cluster; orientation?: Orientation; size?: number }) {
  const order = clusterOrder(tree)
  const positions: Record<number, number> = {}
  order.forEach((idx, i) => {
    positions[idx] = i * size + size / 2
  })

  const depth = getDepth(tree)
  const layout = buildLayout(tree, 0)
  const lines: JSX.Element[] = []
  buildLines(layout)

  const width = order.length * size
  const height = depth * size
  let svgWidth = width
  let svgHeight = height
  const style: React.CSSProperties | undefined =
    orientation === 'left' ? { transform: 'rotate(-90deg)' } : undefined
  if (orientation === 'left') {
    svgWidth = height
    svgHeight = width
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={style}
      className="dendrogram"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      {lines}
    </svg>
  )

  function getDepth(node: Cluster): number {
    if (!node.left || !node.right) return 0
    return 1 + Math.max(getDepth(node.left), getDepth(node.right))
  }

  interface Layout {
    x: number
    y: number
    left?: Layout
    right?: Layout
  }

  function buildLayout(node: Cluster, level: number): Layout {
    if (!node.left || !node.right) {
      const idx = node.indices[0]
      return { x: positions[idx], y: level }
    }
    const left = buildLayout(node.left, level + 1)
    const right = buildLayout(node.right, level + 1)
    return { x: (left.x + right.x) / 2, y: level, left, right }
  }

  function buildLines(node: Layout) {
    if (!node.left || !node.right) return
    const parentY = node.y * size
    const childY = (node.y + 1) * size
    lines.push(
      <line key={lines.length} x1={node.left.x} y1={childY} x2={node.left.x} y2={parentY} />
    )
    lines.push(
      <line key={lines.length} x1={node.right.x} y1={childY} x2={node.right.x} y2={parentY} />
    )
    lines.push(
      <line key={lines.length} x1={node.left.x} y1={parentY} x2={node.right.x} y2={parentY} />
    )
    buildLines(node.left)
    buildLines(node.right)
  }
}

export default function CorrelationRippleMatrix({
  labels,
  matrix,
  drilldown,
  showDendrogram = true,
}: Props) {
  const { labels: orderedLabels, matrix: orderedMatrix, tree } =
    useCorrelationMatrix(labels, matrix, drilldown)

  const size = 20

  return (
    <div className="correlation-ripple-matrix" style={{ display: 'inline-block' }}>
      {showDendrogram && tree && <Dendrogram tree={tree} orientation="top" size={size} />}
      <div style={{ display: 'flex' }}>
        {showDendrogram && tree && <Dendrogram tree={tree} orientation="left" size={size} />}
        <table>
          <thead>
            <tr>
              <th></th>
              {orderedLabels.map(l => (
                <th key={l}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderedMatrix.map((row, i) => (
              <tr key={i}>
                <th>{orderedLabels[i]}</th>
                {row.map((val, j) => (
                  <td key={j}>{typeof val === 'number' ? val.toFixed(2) : val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

