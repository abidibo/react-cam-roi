import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import EditorProvider from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css, log } from '../../Utils'
import { Loader } from '../Loader'
import Canvas from './Canvas'
import Header from './Header'
import { useCanvasSize } from './Hooks'
import styles from './RoiEditor.module.css'
import ShapesList from './ShapesList'
import Toolbar from './Toolbar'
import { Configuration, Metadata, Output, OutputParameter, Shape, Shapes, ShapeType, ToolEnum } from './Types'
import { enableMainMetadata, fabricShapeToOutputShape, validate } from './Utils'
import ParametersModalForm from './ParametersModalForm'
import SaveIcon from '../../Icons/SaveIcon'

export type RoiEditorProps = {
  // the url of the image we want to annotate
  imageUrl: string
  configuration: Configuration
  onSubmit: (data: Output) => void
  onUpdate?: (data: Output) => void
  initialData?: Output
  editorId: string
}

// https://github.com/n-mazaheri/image-editor
const RoiEditor: React.FC<RoiEditorProps> = ({
  imageUrl,
  configuration,
  onSubmit,
  onUpdate,
  initialData,
  editorId,
}) => {
  const firstUpdate = useRef(true)
  const { themeMode, enableLogs, pickerColors, strings, notify, AnnotateIcon, Button, primaryFgColor } = useContext(UiContext)
  const { imageSize, canvasSize, wrapperRef, isReady } = useCanvasSize(imageUrl)

  const [activeTool, setActiveTool] = useState(ToolEnum.Pointer)
  const [activeColor, setActiveColor] = useState(pickerColors[0])

  const [form, setForm] = useState<{ isOpen: boolean }>({ isOpen: false })

  // metadata
  const [metadata, setMetadata] = useState<Metadata>({
    parameters: [
      ...(configuration.parameters.map((p) => {
        const initial = initialData?.parameters.find((initP) => initP.codename === p.codename)
        return {
          codename: p.codename,
          value: initial ? initial.value : p.value,
        }
      }) ?? []),
    ],
    rois: [],
  })

  const handleSubmitMetadata = (data: OutputParameter[]) => {
    setMetadata({
      ...metadata,
      parameters: data,
    })
    setForm({ isOpen: false })
  }

  // fabric shapes
  const [shapes, setShapes] = useState<Shapes>({})
  const addShape = useCallback(
    (id: string, type: ShapeType, shape: Shape) => setShapes({ ...shapes, [id]: { type, shape } }),
    [shapes],
  )
  const addShapes = useCallback(
    (s: { id: string; type: ShapeType; shape: Shape }[]) =>
      setShapes({ ...shapes, ...s.reduce((r, s) => ({ ...r, [s.id]: s }), {}) }),
    [shapes],
  )
  const removeShape = useCallback(
    (id: string) => {
      const newShapes = { ...shapes }
      delete newShapes[id]
      setShapes(newShapes)
      setMetadata({ ...metadata, rois: metadata.rois.filter((r) => r.id !== id) })
    },
    [shapes, metadata],
  )

  const prepareOutput = useCallback((metadata: Metadata, shapes: Shapes) => {
    return {
      parameters: metadata.parameters?.map((p) => ({ codename: p.codename, value: p.value })) ?? [],
      rois: Object.keys(shapes).map((shapeId) => ({
        parameters:
          metadata.rois
            .find((r) => r.id === shapeId)
            ?.parameters?.map((p) => ({ codename: p.codename, value: p.value })) ?? [],
        name: metadata.rois.find((r) => r.id === shapeId)?.name ?? '',
        role: metadata.rois.find((r) => r.id === shapeId)?.role ?? '',
        type: shapes[shapeId].type,
        id: shapeId,
        shape: fabricShapeToOutputShape(shapes[shapeId].shape, shapes[shapeId].shape.type as ShapeType, imageSize),
      })),
    }
  }, [imageSize])

  useEffect(() => {
    // do not run on first update
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    } else if (onUpdate) {
      // notify every update
      onUpdate(prepareOutput(metadata, shapes))
    }
  }, [metadata, shapes, onUpdate, prepareOutput])

  const handleSubmit = useCallback(() => {
    const [isValid, errors] = validate(configuration, shapes, metadata, strings)
    if (isValid) {
      onSubmit(prepareOutput(metadata, shapes))
    } else {
      notify.error(strings.invalidSubmission + '\n' + errors.map((e) => `- ${e}`).join('\n'))
    }
  }, [onSubmit, configuration, shapes, metadata, prepareOutput, strings, notify])

  const iconColor = themeMode === 'light' ? 'black' : 'white'

  log('info', enableLogs, 'react-cam-roi', 'active tool', activeTool)
  log('info', enableLogs, 'react-cam-roi', 'canvas size', canvasSize)
  log('info', enableLogs, 'react-cam-roi', 'metadata', metadata)

  if (!isReady) {
    return <Loader />
  }
  return (
    <EditorProvider
      editorId={editorId}
      hideForbiddenTools={configuration.options?.hideForbiddenTools ?? false}
      activeTool={activeTool}
      setActiveTool={setActiveTool}
      activeColor={activeColor}
      setActiveColor={setActiveColor}
      shapes={shapes}
      addShape={addShape}
      addShapes={addShapes}
      removeShape={removeShape}
      configuration={configuration}
      metadata={metadata}
      setMetadata={setMetadata}
      onSubmit={handleSubmit}
    >
      <div style={{ maxWidth: '100%', width: `${imageSize.width}px` }} ref={wrapperRef}>
      <div className={styles.mainHeader}>
        {enableMainMetadata(configuration) && (
          <Button onClick={() => setForm({ isOpen: true })}>
            <AnnotateIcon color={iconColor} /> {strings.mainParametersMetadata}
          </Button>
        )}
        <Button primary onClick={handleSubmit}>
          <SaveIcon color={primaryFgColor} /> {strings.save}
        </Button>
      </div>
        <Header />
        <Toolbar />
        <div
          className={css('canvasWrapper', styles, themeMode)}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          <Canvas imageSize={imageSize} canvasSize={canvasSize} initialData={initialData} />
        </div>
        <ShapesList />
      </div>
      {form.isOpen && (
        <ParametersModalForm
          parameters={configuration.parameters}
          data={metadata.parameters}
          title={strings.mainParametersMetadata}
          onClose={() => setForm({ isOpen: false })}
          onSubmit={handleSubmitMetadata}
        />
      )}
    </EditorProvider>
  )
}

export default RoiEditor
