import { useRef, useEffect } from 'react'
import * as fabric from 'fabric'
import { useEditorContext } from '../../Providers/EditorProvider';
import { useTool } from './Hooks';

type CanvasProps = {
  canvasSize: { width: number; height: number }
}
const Canvas: React.FC<CanvasProps> = ({ canvasSize }) => {
  const { activeTool } = useEditorContext()
  const canvasRef = useRef<fabric.Canvas>(null)

  useTool(activeTool, canvasRef.current)

  useEffect(() => {
    canvasRef.current = new fabric.Canvas('react-cam-roi-canvas')
    canvasRef.current.setDimensions({ width: canvasSize.width, height: canvasSize.height })

    return () => {
      canvasRef.current?.dispose()
    }
  }, [canvasSize.width, canvasSize.height])
  return <canvas id="react-cam-roi-canvas" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }} />
}
export default Canvas
