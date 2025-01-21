import * as fabric from 'fabric'
import { FabricEvent } from './Types'

const addPoint = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  polygonPoints: { x: number; y: number }[],
  setPolygonPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  const pointer = canvas.getScenePoint(event.e)
  const newPoint = { x: pointer.x, y: pointer.y }
  setPolygonPoints([...polygonPoints, newPoint])
  if (polygonPoints.length > 0) {
    const line = new fabric.Line(
      [polygonPoints[polygonPoints.length - 1].x, polygonPoints[polygonPoints.length - 1].y, pointer.x, pointer.y],
      {
        stroke: 'black',
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
      },
    )
    canvas.add(line)
    setLines([...lines, line])
  }
}

export const handleMouseDownPolygon = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  setIsDrawing: (v: boolean) => void,
  setPolygonPoints: (v: { x: number; y: number }[]) => void,
  setLines: (v: fabric.Line[]) => void,
) => {
  setIsDrawing(true)
  addPoint(event, canvas, [], setPolygonPoints, [], setLines)
}

export const handleMouseMovePolygon = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  isDrawing: boolean,
  lines: fabric.Line[],
) => {
  if (isDrawing && lines.length > 0) {
    const pointer = canvas.getScenePoint(event.e)
    lines[lines.length - 1].set({ x2: pointer.x, y2: pointer.y })
    canvas.renderAll()
  }
}

export const handleDoubleClickPolygon = (
  canvas: fabric.Canvas,
  setIsDrawing: (v: boolean) => void,
  polygonPoints: { x: number; y: number }[],
  setPolygonPoints: (v: { x: number; y: number }[]) => void,
  setLines: (v: fabric.Line[]) => void,

) => {
  if (polygonPoints.length > 2) {
    // const id = uuidv4()
    const polygon = new fabric.Polygon(polygonPoints, {
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    })
    canvas.add(polygon)
    setPolygonPoints([])
    setLines([])
    setIsDrawing(false)
  }
}
