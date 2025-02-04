import { useContext } from 'react'

import { UiContext } from '../../../Providers/UiProvider'
import { css } from '../../../Utils'
import { useParametersForm } from '../Hooks'
import ParameterField from '../ParameterField'
import { ConfigurationParameter } from '../Types'
import styles from './ParametersModalForm.module.css'
import { validateParametersForm } from '../Utils'

export type ParametersModalFormProps = {
  onClose: () => void
  title: string
  parameters: ConfigurationParameter[]
  data: ConfigurationParameter[]
  onSubmit: (data: ConfigurationParameter[]) => void
}

const ParametersModalForm: React.FC<ParametersModalFormProps> = ({ title, onClose, parameters, data, onSubmit }) => {
  const { Modal } = useContext(UiContext)
  const { fields, setField, errors, setErrors } = useParametersForm(data)

  const handleSubmit = () => {
    if (validateParametersForm(parameters, fields, setErrors)) {
      onSubmit([...parameters.map((p) => ({ ...p, value: fields[p.codename] }))] as ConfigurationParameter[])
    }
  }

  return (
    <Modal onClose={onClose} title={title} isOpen maxWidth="sm" onSubmit={handleSubmit}>
      <div className={css('form', styles, null)}>
        {parameters.map((parameter: ConfigurationParameter) => {
          switch (parameter.type) {
            case 'string':
              return (
                <ParameterField<string>
                  key={parameter.codename}
                  value={String(fields[parameter.codename])}
                  onChange={setField<string>(parameter.codename)}
                  parameter={parameter}
                  errors={errors}
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
                  errors={errors}
                />
              )
            case 'bool':
              return (
                <ParameterField<boolean>
                  key={parameter.codename}
                  value={fields[parameter.codename] as boolean}
                  onChange={setField<boolean>(parameter.codename)}
                  parameter={parameter}
                  errors={errors}
                />
              )
            default:
              return null
          }
        })}
      </div>
    </Modal>
  )
}

export default ParametersModalForm
