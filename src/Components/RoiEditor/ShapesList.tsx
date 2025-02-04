import { useContext, useEffect, useState } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import Dispatcher from '../../Utils/Dispatcher'
import ParametersModalForm from './ParametersModalForm'
import styles from './ShapesList.module.css'
import { ConfigurationParameter, Shape } from './Types'

const ShapesList: React.FC = () => {
  const { strings, Typography, IconButton, DeleteIcon, AnnotateIcon, SelectIcon, CopyIcon, themeMode } =
    useContext(UiContext)
  const { shapes, removeShape, configuration, metadata, setMetadata } = useEditorContext()
  const [selected, setSelected] = useState<string[]>([])
  const [form, setForm] = useState<{ isOpen: boolean; shapeId: string }>({ isOpen: false, shapeId: '' })

  useEffect(() => {
    const setSelectedShapes = (_: string, event: Shape[]) => setSelected(event?.map((s: Shape) => s.id!) ?? [])
    Dispatcher.register('canvas:shapeSelected', setSelectedShapes)

    return () => {
      Dispatcher.unregister('canvas:shapeSelected', setSelectedShapes)
    }
  }, [shapes])

  const handleCopyShape = (id: string) => () => {
    Dispatcher.emit('canvas:copyShape', id)
  }

  const handleRemoveShape = (id: string) => () => {
    Dispatcher.emit('canvas:removeShape', id)
    removeShape(id)
  }

  const handleSelectShape = (id: string) => () => {
    Dispatcher.emit('canvas:selectShape', id)
  }

  const handleEditShapeMetadata = (id: string) => () => {
    setForm({ isOpen: true, shapeId: id })
  }

  const handleSubmitMetadata = (shapeId: string) => (data: ConfigurationParameter[]) => {
    setMetadata({
      ...metadata,
      rois: [
        ...metadata.rois.filter((r) => r.id !== shapeId),
        { id: shapeId, parameters: data },
      ]
    })
    setForm({ isOpen: false, shapeId: '' })
  }

  const iconColor = themeMode === 'light' ? 'black' : 'white'

  return (
    <>
      <table className={css('shapes-table', styles, themeMode)}>
        {Object.keys(shapes).length > 0 && (
          <thead>
            <tr>
              <th>
                <Typography>{strings.id}</Typography>
              </th>
              <th>
                <Typography>{strings.type}</Typography>
              </th>
              <th />
            </tr>
          </thead>
        )}
        <tbody>
          {Object.keys(shapes).map((id) => {
            return (
              <tr key={id} className={selected.indexOf(id) > -1 ? css('shapes-row-selected', styles, themeMode) : ''}>
                <td>
                  <div>
                    <Typography>{id.substring(0, 6)}</Typography>
                  </div>
                </td>
                <td>
                  <Typography>{strings[shapes[id].type]}</Typography>
                </td>
                <td>
                  <IconButton onClick={handleSelectShape(id)}>
                    <SelectIcon color={iconColor} />
                  </IconButton>
                  <IconButton onClick={handleCopyShape(id)}>
                    <CopyIcon color={iconColor} />
                  </IconButton>
                  <IconButton
                    onClick={handleEditShapeMetadata(id)}
                    disabled={!configuration.rois.find((roi) => roi.type === shapes[id].type)}
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
          parameters={configuration.rois.find((roi) => roi.type === shapes[form.shapeId].type)?.parameters ?? []}
          data={
            metadata.rois.find((roi) => roi.id === form.shapeId)?.parameters ??
            configuration.rois.find((roi) => roi.type === shapes[form.shapeId].type)?.parameters ??
            []
          }
          title={strings.mainParametersMetadata}
          onClose={() => setForm({ isOpen: false, shapeId: '' })}
          onSubmit={handleSubmitMetadata(form.shapeId)}
        />
      )}
    </>
  )
}
export default ShapesList
