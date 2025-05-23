import * as fabric from 'fabric';
import { v4 as uuidv4 } from 'uuid';

import { FabricEvent, ToolEnum } from './Types';
import Dispatcher from '../../Utils/Dispatcher';

const addPoint = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  color: string,
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
        stroke: color,
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
  activeColor: string,
  setIsDrawing: (v: boolean) => void,
  points: { x: number; y: number }[],
  setPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  setIsDrawing(true)
  addPoint(event, canvas, activeColor, points, setPoints, lines, setLines)
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
  editorId: string,
  canvas: fabric.Canvas,
  activeColor: string,
  setIsDrawing: (v: boolean) => void,
  points: { x: number; y: number }[],
  setPoints: (v: { x: number; y: number }[]) => void,
  lines: fabric.Line[],
  setLines: (v: fabric.Line[]) => void,
) => {
  if (points.length > 2) {
    const id = uuidv4()
    const polyline = new fabric.Polyline(points, {
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 2,
      strokeUniform: true,
      selectable: false,
      hasControls: true,
      lockRotation: false,
      id,
    })
    canvas.add(polyline)
    Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Polyline, shape: polyline })
    setPoints([])
    for (const line of lines) {
      canvas.remove(line) // Remove temporary lines
    }
    setLines([])
    setIsDrawing(false)
  }
}

export const copyPolyline = (editorId: string, canvas: fabric.Canvas, polyline: fabric.Polyline) => {
  const id = uuidv4()
  const copy = new fabric.Polyline(polyline.points, {
    top: polyline.top + 10,
    left: polyline.left + 10,
    fill: 'transparent',
    stroke: polyline.stroke,
    strokeWidth: polyline.strokeWidth,
    strokeUniform: true,
    selectable: false,
    hasControls: true,
    hoverCursor: 'default',
    id,
  })
  canvas.add(copy)
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Polyline, shape: copy })
  return copy
}
