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
  const newPolylinePoints = [...points, newPoint]
  setPoints(newPolylinePoints)
  if (newPolylinePoints.length > 0) {
    const line = new fabric.Line(
      [
        newPolylinePoints[newPolylinePoints.length - 1].x,
        newPolylinePoints[newPolylinePoints.length - 1].y,
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

export const handleMouseDownPolyline = (
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

export const handleMouseMovePolyline = (
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

export const handleDoubleClickPolyline = (
  canvas: fabric.Canvas,
  setIsDrawing: (v: boolean) => void,
  points: { x: number; y: number }[],
  setPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  if (points.length > 2) {
    const id = uuidv4()
    const polyline = new fabric.Polyline(points, {
      fill: '#00000000',
      stroke: '#000000',
      strokeWidth: 2,
      selectable: false,
      hasControls: true,
      lockRotation: false,
      id,
    })
    canvas.add(polyline)
    setPoints([])
    for (const line of lines) {
      canvas.remove(line) // Remove temporary lines
    }
    setLines([])
    setIsDrawing(false)
  }
}
