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
  const newPolygonPoints = [...polygonPoints, newPoint]
  setPolygonPoints(newPolygonPoints)
  if (newPolygonPoints.length > 0) {
    const line = new fabric.Line(
      [
        newPolygonPoints[newPolygonPoints.length - 1].x,
        newPolygonPoints[newPolygonPoints.length - 1].y,
        pointer.x,
        pointer.y,
      ],
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
  polygonPoints: { x: number; y: number }[],
  setPolygonPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  setIsDrawing(true)
  addPoint(event, canvas, polygonPoints, setPolygonPoints, lines, setLines)
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
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  if (polygonPoints.length > 2) {
    const polygon = new fabric.Polygon(polygonPoints, {
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      selectable: false,
      hasControls: true,
      hoverCursor: 'default',
    })
    canvas.add(polygon)
    setPolygonPoints([])
    for (const line of lines) {
      canvas.remove(line) // Remove temporary lines
    }
    setLines([])
    setIsDrawing(false)
  }
}
