import * as fabric from 'fabric'
import { useEffect, useState, useContext } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { initCanvasData, useDispatcherEvents, useTool } from './Hooks'
import { Output } from './Types'

type CanvasProps = {
  canvasSize: { width: number; height: number }
  imageSize: { width: number; height: number }
  initialData?: Output
  canvasRef: React.MutableRefObject<fabric.Canvas | null>
}
const Canvas: React.FC<CanvasProps> = ({ canvasRef, canvasSize, imageSize, initialData }) => {
  const { metadata, setMetadata, addShapes, editorId } = useEditorContext()
  const { enableLogs } = useContext(UiContext)
  const [initialized, setInitialized] = useState(false)

  useTool(canvasRef.current)
  useDispatcherEvents(canvasRef.current)

  useEffect(() => {
    if (canvasSize.width !== 0 && canvasSize.height !== 0 && !initialized) {
      canvasRef.current = new fabric.Canvas(`react-cam-roi-canvas-${editorId}`)
      canvasRef.current.setDimensions({ width: canvasSize.width, height: canvasSize.height })
      initCanvasData(canvasRef, canvasSize, addShapes, metadata, setMetadata, initialData, enableLogs)
      setInitialized(true)
    }

    return () => {
      if (initialized) {
        canvasRef.current?.dispose()
      }
    }
  }, [canvasSize.width, canvasSize.height]) // eslint-disable-line

  return (
    <canvas
      id={`react-cam-roi-canvas-${editorId}`}
      style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
    />
  )
}
export default Canvas
