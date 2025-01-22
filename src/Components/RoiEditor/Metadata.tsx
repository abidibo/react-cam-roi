import { useEditorContext } from '../../Providers/EditorProvider'
import Dispatcher from '../../Utils/Dispatcher'

const Metadata: React.FC = () => {
  const { shapes } = useEditorContext()

  const handleRemoveShape = (id: string) => () => Dispatcher.emit('removeShape', id) 

  return (
    <div>
      {Object.keys(shapes).map((id) => {
        return <div onClick={handleRemoveShape(id)}>{id}</div>
      })}
    </div>
  )
}
export default Metadata
