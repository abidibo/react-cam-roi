import * as fabric from 'fabric'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { log } from '../../Utils'
import Dispatcher from '../../Utils/Dispatcher'
import { copyPolygon, handleDoubleClickPolygon, handleMouseDownPolygon, handleMouseMovePolygon } from './Polygon'
import { copyPolyline, handleDoubleClickPolyline, handleMouseDownPolyline, handleMouseMovePolyline } from './Polyline'
import { copyRectangle, handleMouseDownRect, handleMouseMoveRect, handleMouseUpRect } from './Rectangle'
import {
  FabricEvent,
  FabricSelectionEvent,
  Metadata,
  Output,
  OutputParameter,
  OutputShapePolygon,
  OutputShapePolyline,
  OutputShapeRect,
  Shape,
  ShapeType,
  ToolEnum,
} from './Types'
import { canDrawShape } from './Utils'

export const useImageSize = (imageUrl: string) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height })
    }
  }, [imageUrl])

  return { imageSize, isReady: imageSize.width > 0 }
}

export const useCanvasSize = (imageUrl: string) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const { imageSize, isReady } = useImageSize(imageUrl)

  useEffect(() => {
    if (wrapperRef.current) {
      const update = () => {
        const availableWidth = wrapperRef.current!.offsetWidth
        if (availableWidth < imageSize.width) {
          setCanvasSize({
            width: availableWidth,
            height: availableWidth * (imageSize.height / imageSize.width),
          })
        } else {
          setCanvasSize({
            width: imageSize.width,
            height: imageSize.height,
          })
        }
      }
      if (imageSize.width > 0 && wrapperRef.current) {
        update()
      }
    }
  }, [imageSize, wrapperRef.current]) // eslint-disable-line

  return { imageSize, canvasSize, wrapperRef, isReady }
}

export const initCanvasData = (
  canvasRef: React.MutableRefObject<fabric.Canvas | null>,
  addShapes: (shapes: {id: string, type: ShapeType, shape: Shape}[]) => void,
  metadata: Metadata,
  setMetadata: (v: Metadata) => void,
  initialData?: Output,
  enableLogs?: boolean,
) => {
  log('info', enableLogs ?? false, 'Loading initial shapes data', initialData, canvasRef.current)
  if (initialData?.rois) {
    const m: { id: string; parameters: OutputParameter[] }[] = []
    const s: { id: string; type: ShapeType; shape: Shape }[] = []
    initialData.rois.forEach((r) => {
      log('info', enableLogs ?? false, 'Loading initial shape', r)
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
      m.push({ id, parameters: r.parameters })
      s.push({ id, type: r.type, shape })
    })
    addShapes(s)
    setMetadata({ ...metadata, rois: m })
  }
}

export const useTool = (canvas: fabric.Canvas | null) => {
  const { editorId, configuration, activeTool, activeColor, shapes, addShape } = useEditorContext()
  const { notify, strings } = useContext(UiContext)

  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState<Shape | null>(null)
  const [originX, setOriginX] = useState(0)
  const [originY, setOriginY] = useState(0)
  const [startPos] = useState({ x: 0, y: 0 })
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [lines, setLines] = useState<fabric.Line[]>([])

  // Handler for object selected event to update style settings
  const handleObjectSelected = useCallback((event: FabricSelectionEvent) => {
    Dispatcher.emit(`canvas:${editorId}:shapeSelected`, event.selected ?? null)
  }, [editorId])

  // Handler for selection cleared event to reset selected shapes state
  const handleSelectionCleared = useCallback(() => {
    Dispatcher.emit(`canvas:${editorId}:shapeSelected`, null)
  }, [editorId])

  useEffect(() => {
    if (!canvas) {
      return
    }

    if (activeTool === ToolEnum.Pointer) {
      // enable selection
      canvas.selection = true
      canvas.getObjects().forEach((object) => {
        object.selectable = true
      })
      canvas.renderAll()
    } else {
      // disable selection
      canvas.selection = false
      canvas.discardActiveObject()
      Dispatcher.emit(`canvas:${editorId}:shapeSelected`, null)
      canvas.renderAll()
    }

    const handleMouseDown = (event: FabricEvent) => {
      switch (activeTool) {
        case ToolEnum.Rectangle:
          if (!canDrawShape(configuration, ToolEnum.Rectangle, shapes, notify, strings.cannotDrawMoreRectangles)) return
          handleMouseDownRect(event, canvas, activeColor, setOriginX, setOriginY, setShape, setIsDrawing)
          break
        case ToolEnum.Polygon:
          if (!canDrawShape(configuration, ToolEnum.Polygon, shapes, notify, strings.cannotDrawMorePolygons)) return
          handleMouseDownPolygon(event, canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines)
          break
        case ToolEnum.Polyline:
          if (!canDrawShape(configuration, ToolEnum.Polyline, shapes, notify, strings.cannotDrawMorePolylines)) return
          handleMouseDownPolyline(event, canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines)
          break
        default:
          break
      }
    }

    const handleMouseMove = (event: FabricEvent) => {
      switch (activeTool) {
        case ToolEnum.Rectangle:
          handleMouseMoveRect(event, canvas, originX, originY, shape as Shape, isDrawing)
          break
        case ToolEnum.Polygon:
          handleMouseMovePolygon(event, canvas, isDrawing, lines)
          break
        case ToolEnum.Polyline:
          handleMouseMovePolyline(event, canvas, isDrawing, lines)
          break
        default:
          break
      }
    }

    const handleMouseUp = () => {
      switch (activeTool) {
        case ToolEnum.Rectangle:
          handleMouseUpRect(editorId, canvas, setIsDrawing, shape as Shape, setShape)
          break
        default:
          break
      }
    }

    const handleDoubleClick = () => {
      switch (activeTool) {
        case ToolEnum.Polygon:
          handleDoubleClickPolygon(editorId, canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines)
          break
        case ToolEnum.Polyline:
          handleDoubleClickPolyline(editorId, canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines)
          break
        default:
          break
      }
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    canvas.on('mouse:dblclick', handleDoubleClick)
    canvas.on('selection:created', handleObjectSelected)
    canvas.on('selection:updated', handleObjectSelected)
    canvas.on('selection:cleared', handleSelectionCleared)

    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
      canvas.off('mouse:dblclick', handleDoubleClick)
      canvas.off('selection:created', handleObjectSelected)
      canvas.off('selection:updated', handleObjectSelected)
      canvas.off('selection:cleared', handleSelectionCleared)
    }
  }, [
    activeTool,
    activeColor,
    isDrawing,
    shape,
    originX,
    originY,
    startPos,
    lines,
    points,
    canvas,
    addShape,
    handleObjectSelected,
    handleSelectionCleared,
    configuration,
    notify,
    strings,
    shapes,
    editorId,
  ])
}

export const useDispatcherEvents = (canvas: fabric.Canvas | null) => {
  const { configuration, shapes, addShape, setActiveTool, editorId } = useEditorContext()
  const { notify, strings } = useContext(UiContext)

  useEffect(() => {
    const removeShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      if (obj) {
        canvas?.remove(obj)
      }
    }

    const copyShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      let copy: fabric.Object

      switch (obj?.type) {
        case ToolEnum.Polygon:
          if (!canDrawShape(configuration, ToolEnum.Polygon, shapes, notify, strings.cannotDrawMorePolygons)) return
          copy = copyPolygon(id, canvas!, obj as fabric.Polygon)
          // @ts-expect-error id exists but his stupid ts does not know
          Dispatcher.emit(`canvas:${editorId}:selectShape`, copy.id)
          break
        case ToolEnum.Polyline:
          if (!canDrawShape(configuration, ToolEnum.Polyline, shapes, notify, strings.cannotDrawMorePolylines)) return
          copy = copyPolyline(id, canvas!, obj as fabric.Polyline)
          // @ts-expect-error id exists but his stupid ts does not know
          Dispatcher.emit(`canvas:${editorId}:selectShape`, copy.id)
          break
        case ToolEnum.Rectangle:
          if (!canDrawShape(configuration, ToolEnum.Rectangle, shapes, notify, strings.cannotDrawMoreRectangles)) return
          copy = copyRectangle(id, canvas!, obj as fabric.Rect)
          // @ts-expect-error id exists but his stupid ts does not know
          Dispatcher.emit(`canvas:${editorId}:selectShape`, copy.id)
          break
        default:
          break
      }
    }

    const selectShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      if (obj) {
        canvas?.discardActiveObject()
        canvas?.setActiveObject(obj)
        canvas?.requestRenderAll()
        setActiveTool(ToolEnum.Pointer)
      }
    }

    Dispatcher.register(`canvas:${editorId}:removeShape`, removeShape)
    Dispatcher.register(`canvas:${editorId}:copyShape`, copyShape)
    Dispatcher.register(`canvas:${editorId}:selectShape`, selectShape)

    return () => {
      Dispatcher.unregister(`canvas:${editorId}:removeShape`, removeShape)
      Dispatcher.unregister(`canvas:${editorId}:copyShape`, copyShape)
      Dispatcher.unregister(`canvas:${editorId}:selectShape`, selectShape)
    }
  }, [setActiveTool, canvas, addShape, configuration, shapes, notify, strings, editorId])
}

export const useParametersForm = (parameters: OutputParameter[]) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fields, setFields] = useState<Record<string, unknown>>(
    parameters.reduce((acc, p) => ({ ...acc, [p.codename]: p.value }), {}),
  )
  const setField =
    <T,>(key: string) =>
      (value: T) => {
        setFields({ ...fields, [key]: value })
      }

  return {
    fields,
    setField,
    setFields,
    errors,
    setErrors,
  }
}
