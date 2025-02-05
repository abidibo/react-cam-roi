import * as fabric from 'fabric'
import { useRef, useEffect, useState, useContext } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { initCanvasData, useDispatcherEvents, useTool } from './Hooks'
import { Output } from './Types'

type CanvasProps = {
  canvasSize: { width: number; height: number }
  initialData?: Output
}
const Canvas: React.FC<CanvasProps> = ({ canvasSize, initialData }) => {
  const { metadata, setMetadata, addShapes, id } = useEditorContext()
  const { enableLogs } = useContext(UiContext)
  const [initialized, setInitialized] = useState(false)
  const canvasRef = useRef<fabric.Canvas | null>(null)

  useTool(canvasRef.current)
  useDispatcherEvents(canvasRef.current)

  useEffect(() => {
    if (canvasSize.width !== 0 && canvasSize.height !== 0 && !initialized) {
      canvasRef.current = new fabric.Canvas('react-cam-roi-canvas')
      canvasRef.current.setDimensions({ width: canvasSize.width, height: canvasSize.height })
      initCanvasData(canvasRef, addShapes, metadata, setMetadata, initialData, enableLogs)
      setInitialized(true)
    }

    return () => {
      canvasRef.current?.dispose()
    }
  }, [canvasSize.width, canvasSize.height]) // eslint-disable-line

  return (
    <canvas id={`react-cam-roi-canvas-${id}`} style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }} />
  )
}
export default Canvas
