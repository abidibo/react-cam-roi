import { useContext, useEffect, useState } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import Dispatcher from '../../Utils/Dispatcher'
import styles from './Metadata.module.css'
import { Shape } from './Types'

const Metadata: React.FC = () => {
  const { strings, Typography, IconButton, DeleteIcon, EditIcon, SelectIcon, themeMode } = useContext(UiContext)
  const { shapes, removeShape } = useEditorContext()
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const setSelectedShapes = (_: string, event: Shape[]) => setSelected(event?.map((s: Shape) => s.id!) ?? [])
    Dispatcher.register('canvas:shapeSelected', setSelectedShapes)

    return () => {
      Dispatcher.unregister('canvas:shapeSelected', setSelectedShapes)
    }
  }, [shapes])

  const handleRemoveShape = (id: string) => () => {
    Dispatcher.emit('canvas:removeShape', id)
    removeShape(id)
  }

  const handleSelectShape = (id: string) => () => {
    Dispatcher.emit('canvas:selectShape', id)
  }

  const iconColor = themeMode === 'light' ? 'black' : 'white'

  return (
    <table className={css('metadata-table', styles, themeMode)}>
      {Object.keys(shapes).length > 0 && (
        <thead>
          <tr>
            <th><Typography>{strings.id}</Typography></th>
            <th><Typography>{strings.type}</Typography></th>
            <th />
          </tr>
        </thead>
      )}
      <tbody>
        {Object.keys(shapes).map((id) => {
          return (
            <tr key={id} className={selected.indexOf(id) > -1 ? css('metadata-row-selected', styles, themeMode) : ''}>
              <td>
                <div><Typography>{id.substring(0, 6)}</Typography></div>
              </td>
              <td><Typography>{strings[shapes[id].type]}</Typography></td>
              <td>
                <IconButton onClick={handleSelectShape(id)}>
                  <SelectIcon color={iconColor} />
                </IconButton>
                <IconButton onClick={handleRemoveShape(id)}>
                  <EditIcon color={iconColor} />
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
  )
}
export default Metadata
