import { useContext } from 'react'
import { useEditorContext } from '../../Providers/EditorProvider'
import Dispatcher from '../../Utils/Dispatcher'
import { UiContext } from '../../Providers/UiProvider'

const Metadata: React.FC = () => {
  const { strings } = useContext(UiContext)
  const { shapes, removeShape } = useEditorContext()

  const handleRemoveShape = (id: string) => () => {
    Dispatcher.emit('canvas:removeShape', id)
    removeShape(id)
  }

  return (
    <table>
      <tr>
        <td>{strings.id}</td>
        <td>{strings.type}</td>
      </tr>
      {Object.keys(shapes).map((id) => {
        return (
          <tr key={id}>
            <td>
              <div onClick={handleRemoveShape(id)}>{id.substring(0, 6)}</div>
            </td>
            <td>{shapes[id].type}</td>
          </tr>
        )
      })}
    </table>
  )
}
export default Metadata
