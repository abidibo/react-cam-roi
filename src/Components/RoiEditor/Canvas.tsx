import { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useDispatcherEvents, useTool } from './Hooks';
import { OutputRoi } from './Types';

type CanvasProps = {
  canvasSize: { width: number; height: number }
  initialShapes?: OutputRoi[]
}
const Canvas: React.FC<CanvasProps> = ({ canvasSize, initialShapes }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null)

  useTool(canvasRef.current)
  useDispatcherEvents(canvasRef.current)

  useEffect(() => {
    canvasRef.current = new fabric.Canvas('react-cam-roi-canvas')
    canvasRef.current.setDimensions({ width: canvasSize.width, height: canvasSize.height })
    return () => { canvasRef.current?.dispose() }
  }, [canvasSize.width, canvasSize.height])

  return <canvas id="react-cam-roi-canvas" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }} />
}
export default Canvas
