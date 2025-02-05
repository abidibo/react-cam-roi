import * as fabric from 'fabric'
import { useRef, useEffect, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { log } from '../../Utils'
import { useDispatcherEvents, useTool } from './Hooks'
import {
  Output,
  OutputParameter,
  OutputShapePolygon,
  OutputShapePolyline,
  OutputShapeRect,
  Shape, ToolEnum
} from './Types'

type CanvasProps = {
  canvasSize: { width: number; height: number }
  initialData?: Output
}
const Canvas: React.FC<CanvasProps> = ({ canvasSize, initialData }) => {
  const { enableLogs } = useContext(UiContext)
  const { metadata, setMetadata, addShape } = useEditorContext()
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const [initialized, setInitialized] = useState(false)

  useTool(canvasRef.current)
  useDispatcherEvents(canvasRef.current)

  useEffect(() => {
    canvasRef.current = new fabric.Canvas('react-cam-roi-canvas')
    canvasRef.current.setDimensions({ width: canvasSize.width, height: canvasSize.height })
    return () => {
      canvasRef.current?.dispose()
    }
  }, [canvasSize.width, canvasSize.height])

  useEffect(() => {
    if (canvasRef.current && !initialized) {
      setInitialized(true)
      log('info', enableLogs, 'Loading initial shapes data', initialData, canvasRef.current)
      if (initialData?.rois) {
        const m: { id: string; parameters: OutputParameter[] }[] = []
        initialData.rois.forEach((r) => {
          const id = uuidv4()
          let shape: Shape
          switch (r.type) {
            case ToolEnum.Rectangle:
              shape = new fabric.Rect({
                left: r.shape.left,
                top: r.shape.top,
                originX: 'left',
                originY: 'top',
                width: (r.shape as OutputShapeRect).width,
                height: (r.shape as OutputShapeRect).height,
                fill: 'transparent',
                stroke: r.shape.color,
                strokeWidth: 2,
                strokeUniform: true,
                selectable: false,
                hasControls: true,
                hoverCursor: 'default',
                id,
              })
              canvasRef.current?.add(shape)
              break
            case ToolEnum.Polygon:
              shape = new fabric.Polygon((r.shape as OutputShapePolygon).points, {
                top: r.shape.top + 10,
                left: r.shape.left + 10,
                fill: 'transparent',
                stroke: r.shape.color,
                strokeWidth: 2,
                selectable: false,
                hasControls: true,
                hoverCursor: 'default',
                // @ts-expect-error id is not included in types but the property is added and it works
                id,
              })
              canvasRef.current?.add(shape)
              break
            case ToolEnum.Polyline:
                shape = new fabric.Polyline((r.shape as OutputShapePolyline).points, {
                  top: r.shape.top + 10,
                  left: r.shape.left + 10,
                  fill: 'transparent',
                  stroke: r.shape.color,
                  strokeWidth: 2,
                  selectable: false,
                  hasControls: true,
                  hoverCursor: 'default',
                  id,
                })
              canvasRef.current?.add(shape)
              break
          }
          addShape(id, r.type, shape)
          m.push({ id, parameters: r.parameters })
        })
        setMetadata({ ...metadata, rois: m })
      }
    }
  }, [canvasRef.current]) // eslint-disable-line

  return (
    <canvas id="react-cam-roi-canvas" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }} />
  )
}
export default Canvas
