import { useContext, useEffect, useState } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css, humanize } from '../../Utils'
import Dispatcher from '../../Utils/Dispatcher'
import ParametersModalForm from './ParametersModalForm'
import styles from './ShapesList.module.css'
import { OutputParameter, Shape, ShapeType } from './Types'

const ShapesList: React.FC = () => {
  const { strings, Typography, IconButton, DeleteIcon, AnnotateIcon, CopyIcon, themeMode } =
    useContext(UiContext)
  const { shapes, removeShape, configuration, metadata, setMetadata, addShape, editorId } = useEditorContext()
  const [selected, setSelected] = useState<string[]>([])
  const [form, setForm] = useState<{ isOpen: boolean; shapeId: string; type: ShapeType | null; shape: Shape | null }>({
    isOpen: false,
    shapeId: '',
    type: null,
    shape: null,
  })

  // open metadata form immediately after drawing the shape
  useEffect(() => {
    const openForm = (_: unknown, { id, type, shape }: { id: string; type: ShapeType; shape: Shape }) => {
      setForm({ isOpen: true, shapeId: id, type, shape })
    }
    Dispatcher.register<{ id: string; type: ShapeType; shape: Shape }>(`canvas:${editorId}:shapeAdded`, openForm)

    return () => {
      Dispatcher.unregister(`canvas:${editorId}:shapeAdded`, openForm)
    }
  }, [editorId])

  useEffect(() => {
    const setSelectedShapes = (_: string, event: Shape[]) => setSelected(event?.map((s: Shape) => s.id!) ?? [])
    Dispatcher.register(`canvas:${editorId}:shapeSelected`, setSelectedShapes)

    return () => {
      Dispatcher.unregister(`canvas:${editorId}:shapeSelected`, setSelectedShapes)
    }
  }, [shapes, editorId])

  const handleCopyShape = (id: string) => (evt: React.MouseEvent) => {
    evt.stopPropagation()
    Dispatcher.emit(`canvas:${editorId}:copyShape`, id)
  }

  const handleRemoveShape = (id: string) => () => {
    Dispatcher.emit(`canvas:${editorId}:removeShape`, id)
    removeShape(id)
  }

  const handleSelectShape = (id: string) => () => {
    Dispatcher.emit(`canvas:${editorId}:selectShape`, id)
  }

  const handleEditShapeMetadata = (id: string) => () => {
    setForm({ isOpen: true, shapeId: id, type: null, shape: null })
  }

  const handleSubmitMetadata =
    (shapeId: string) => (data: OutputParameter[], properties?: { name: string; role: string }) => {
      // if in creation mode, add the shape
      if (form.type !== null) {
        addShape(shapeId, form.type, form.shape!)
      }
      setMetadata({
        ...metadata,
        rois: [...metadata.rois.filter((r) => r.id !== shapeId), { id: shapeId, parameters: data, ...properties! }],
      })
      setForm({ isOpen: false, shapeId: '', type: null, shape: null })
    }

  const handleCloseMetadataForm = () => {
    // if in creation mode do not add shape and delete shape from canvas
    if (form.type !== null) {
      Dispatcher.emit(`canvas:${editorId}:removeShape`, form.shapeId)
    }
    setForm({ isOpen: false, shapeId: '', type: null, shape: null })
  }

  const iconColor = themeMode === 'light' ? 'black' : 'white'

  return (
    <>
      <table className={css('shapes-table', styles, themeMode)}>
        {Object.keys(shapes).length > 0 && (
          <thead>
            <tr>
              <th>
                <Typography style={{ fontWeight: 'bold' }}>{strings.name}</Typography>
              </th>
              <th>
                <Typography style={{ fontWeight: 'bold' }}>{strings.role}</Typography>
              </th>
              <th>
                <Typography style={{ fontWeight: 'bold' }}>{strings.type}</Typography>
              </th>
              <th />
            </tr>
          </thead>
        )}
        <tbody>
          {Object.keys(shapes).map((id, idx) => {
            const m = metadata.rois.find((roi) => roi.id === id)
            return (
              <tr
                onClick={handleSelectShape(id)}
                key={id}
                className={
                  selected.indexOf(id) > -1
                    ? css('shapes-row-selected', styles, themeMode)
                    : idx % 2 === 0
                      ? css('shapes-row-even', styles, themeMode)
                      : css('shapes-row-odd', styles, themeMode)
                }
              >
                <td>
                  <div className={styles.shapesTableName}>
                    <div
                      className={styles.shapesTableColor}
                      style={{ backgroundColor: shapes[id].shape.stroke as string }}
                    />
                    <Typography>{m?.name}</Typography>
                  </div>
                </td>
                <td>
                  <Typography>{configuration.rois.find(r => r.role === m?.role)?.label}</Typography>
                </td>
                <td>
                  <Typography>{strings[shapes[id].type]}</Typography>
                </td>
                <td>
                  <IconButton onClick={handleCopyShape(id)}>
                    <CopyIcon color={iconColor} />
                  </IconButton>
                  <IconButton
                    onClick={handleEditShapeMetadata(id)}
                  >
                    <AnnotateIcon color={iconColor} />
                  </IconButton>
                  <IconButton onClick={handleRemoveShape(id)}>
                    <DeleteIcon color={iconColor} />
                  </IconButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {form.isOpen && (
        <ParametersModalForm
          shapeType={form.type || shapes[form.shapeId].type}
          shapeName={metadata.rois.find((roi) => roi.id === form.shapeId)?.name ?? ''}
          shapeRole={metadata.rois.find((roi) => roi.id === form.shapeId)?.role ?? ''}
          shapeId={form.shapeId}
          parameters={
            configuration.rois.find((roi) => roi.type === (form.type || shapes[form.shapeId].type))?.parameters ?? []
          }
          data={
            metadata.rois.find((roi) => roi.id === form.shapeId)?.parameters ??
            configuration.rois.find((roi) => roi.type === (form.type || shapes[form.shapeId].type))?.parameters ??
            []
          }
          title={strings.shapeParametersMetadata}
          onClose={handleCloseMetadataForm}
          onSubmit={handleSubmitMetadata(form.shapeId)}
        />
      )}
    </>
  )
}
export default ShapesList
