import * as fabric from 'fabric';
import { v4 as uuidv4 } from 'uuid'

import { FabricEvent } from './Types';

const addPoint = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  points: { x: number; y: number }[],
  setPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  const pointer = canvas.getScenePoint(event.e)
  const newPoint = { x: pointer.x, y: pointer.y }
  const newPolygonPoints = [...points, newPoint]
  setPoints(newPolygonPoints)
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
        strokeUniform: true,
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
  points: { x: number; y: number }[],
  setPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  setIsDrawing(true)
  addPoint(event, canvas, points, setPoints, lines, setLines)
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
  points: { x: number; y: number }[],
  setPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  if (points.length > 2) {
    const id = uuidv4()
    const polygon = new fabric.Polygon(points, {
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      selectable: false,
      hasControls: true,
      hoverCursor: 'default',
      // @ts-expect-error id is not included in types but the property is added and it works
      id,
    })
    canvas.add(polygon)
    setPoints([])
    for (const line of lines) {
      canvas.remove(line) // Remove temporary lines
    }
    setLines([])
    setIsDrawing(false)
  }
}
