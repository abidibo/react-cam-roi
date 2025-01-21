import * as fabric from 'fabric'
import { useContext, useState } from 'react'

import EditorProvider from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css, log } from '../../Utils'
import { Loader } from '../Loader'
import Canvas from './Canvas'
import { useCanvasSize } from './Hooks'
import styles from './RoiEditor.module.css'
import Toolbar from './Toolbar'
import { ToolEnum } from './Types'

export type RoiEditorProps = {
  // the url of the image we want to annotate
  imageUrl: string
}

// https://medium.com/@na.mazaheri/dynamically-drawing-shapes-on-canvas-with-fabric-js-in-react-js-8b9c42791903
// https://github.com/n-mazaheri/image-editor
const RoiEditor: React.FC<RoiEditorProps> = ({ imageUrl }) => {
  const { themeMode, enableLogs } = useContext(UiContext)
  const { imageSize, canvasSize, wrapperRef, isDone } = useCanvasSize(imageUrl)

  // const [isDrawing, setIsDrawing] = useState(false)
  const [activeTool, setActiveTool] = useState(ToolEnum.Pointer)
  const [selectedShapes, setSelectedShapes] = useState<fabric.Object[] | null>(null)
  // const [shape, setShape] = useState(null)

  log('info', enableLogs, 'react-cam-roi', 'active tool', activeTool)
  log('info', enableLogs, 'react-cam-roi', 'canvas size', canvasSize)

  if (!isDone) {
    return <Loader />
  }
  return (
    <EditorProvider
      activeTool={activeTool}
      setActiveTool={setActiveTool}
      selectedShapes={selectedShapes}
      setSelectedShapes={setSelectedShapes}
    >
      <div style={{ maxWidth: '100%', width: `${imageSize.width}px` }} ref={wrapperRef}>
        <Toolbar />
        <div
          className={css('canvasWrapper', styles, themeMode)}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          <Canvas canvasSize={canvasSize} />
        </div>
      </div>
    </EditorProvider>
  )
}

export default RoiEditor
