import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { useParametersForm } from './Hooks'
import ParameterField from './ParameterField'
import { ConfigurationParameter } from './Types'

export type ParametersModalFormProps = {
  onClose: () => void
  title: string
  parameters: ConfigurationParameter[]
}

const ParametersModalForm: React.FC<ParametersModalFormProps> = ({ title, onClose, parameters }) => {
  const { Modal } = useContext(UiContext)
  const { fields, setField } = useParametersForm(parameters)

  return (
    <Modal onClose={onClose} title={title} isOpen size="lg">
      {parameters.map((parameter: ConfigurationParameter) => {
        switch (parameter.type) {
          case 'string':
            return (
              <ParameterField<string>
                key={parameter.codename}
                value={String(fields[parameter.codename])}
                onChange={setField<string>(parameter.codename)}
                parameter={parameter}
              />
            )
          case 'int':
          case 'float':
            return (
              <ParameterField<number>
                key={parameter.codename}
                value={fields[parameter.codename] as number}
                onChange={setField<number>(parameter.codename)}
                parameter={parameter}
              />
            )
          default:
            return null
        }
      })}
    </Modal>
  )
}

export default ParametersModalForm
