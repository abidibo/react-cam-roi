import * as fabric from 'fabric'
import { v4 as uuidv4 } from 'uuid'

import Dispatcher from '../../Utils/Dispatcher'
import { FabricEvent, ToolEnum } from './Types'

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

export const handleMouseDownPolygon = (
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
    const polygon = new fabric.Polygon(points, {
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 2,
      strokeUniform: true,
      selectable: false,
      hasControls: true,
      hoverCursor: 'default',
      // @ts-expect-error id is not included in types but the property is added and it works
      id,
    })
    canvas.add(polygon)
    Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Polygon, shape: polygon })
    setPoints([])
    for (const line of lines) {
      canvas.remove(line) // Remove temporary lines
    }
    setLines([])
    setIsDrawing(false)
  }
}

export const renderFullImagePolygon = (
  editorId: string,
  canvas: fabric.Canvas,
  activeColor: string,
  imageSize: { width: number; height: number },
) => {
  const OFFSET = 5
  const id = uuidv4()
  const points = [
    { x: OFFSET, y: OFFSET },
    { x: imageSize.width - OFFSET, y: OFFSET },
    { x: imageSize.width - OFFSET, y: imageSize.height - OFFSET },
    { x: OFFSET, y: imageSize.height - OFFSET },
  ]
  const polygon = new fabric.Polygon(points, {
    fill: 'transparent',
    stroke: activeColor,
    strokeWidth: 2,
    strokeUniform: true,
    selectable: false,
    hasControls: true,
    hoverCursor: 'default',
    // @ts-expect-error id is not included in types but the property is added and it works
    id,
  })
  canvas.add(polygon)
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Polygon, shape: polygon })
}

export const copyPolygon = (editorId: string, canvas: fabric.Canvas, polygon: fabric.Polygon) => {
  const id = uuidv4()
  const copy = new fabric.Polygon(polygon.points, {
    top: polygon.top + 10,
    left: polygon.left + 10,
    fill: 'transparent',
    stroke: polygon.stroke,
    strokeWidth: polygon.strokeWidth,
    selectable: false,
    hasControls: true,
    hoverCursor: 'default',
    // @ts-expect-error id is not included in types but the property is added and it works
    id,
  })
  canvas.add(copy)
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Polygon, shape: copy })
  return copy
}
