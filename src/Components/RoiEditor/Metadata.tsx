import { useContext } from 'react'

import DeleteIcon from '../../Icons/DeleteIcon'
import EditIcon from '../../Icons/EditIcon'
import SelectIcon from '../../Icons/SelectIcon'
import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import Dispatcher from '../../Utils/Dispatcher'
import styles from './Metadata.module.css'

const Metadata: React.FC = () => {
  const { strings, IconButton, themeMode } = useContext(UiContext)
  const { shapes, removeShape } = useEditorContext()

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
            <th>{strings.id}</th>
            <th>{strings.type}</th>
            <th />
          </tr>
        </thead>
      )}
      <tbody>
        {Object.keys(shapes).map((id) => {
          return (
            <tr key={id}>
              <td>
                <div onClick={handleRemoveShape(id)}>{id.substring(0, 6)}</div>
              </td>
              <td>{strings[shapes[id].type]}</td>
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
