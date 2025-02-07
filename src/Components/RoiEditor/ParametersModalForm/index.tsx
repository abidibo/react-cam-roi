import { useContext, useState } from 'react'

import { UiContext } from '../../../Providers/UiProvider'
import { css } from '../../../Utils'
import RoleField from '../../RoleField'
import { useParametersForm } from '../Hooks'
import ParameterField from '../ParameterField'
import { ConfigurationParameter, OutputParameter, ShapeType } from '../Types'
import { validateParametersForm } from '../Utils'
import styles from './ParametersModalForm.module.css'

export type ParametersModalFormProps = {
  onClose: () => void
  title: string
  parameters: ConfigurationParameter[]
  data: OutputParameter[]
  onSubmit: (data: OutputParameter[], properties?: { name: string, role: string }) => void
  shapeType?: ShapeType
  shapeName?: string
  shapeRole?: string
}

// TODO: role field pass shape type
const ParametersModalForm: React.FC<ParametersModalFormProps> = ({
  title,
  onClose,
  parameters,
  data,
  onSubmit,
  shapeType,
  shapeName,
  shapeRole,
}) => {
  const { Modal, TextField, strings } = useContext(UiContext)
  const [name, setName] = useState(shapeName ?? '')
  const [role, setRole] = useState(shapeRole ?? '')
  const { fields, setField, errors, setErrors } = useParametersForm(data)

  const handleSubmit = () => {
    if (validateParametersForm(parameters, fields, setErrors)) {
      const data = [...parameters.map((p) => ({ codename: p.codename, value: fields[p.codename] }))] as OutputParameter[]
      if (shapeType) {
        onSubmit(data, { name, role })
      } else {
        onSubmit(data)
      }
    }
  }

  return (
    <Modal onClose={onClose} title={title} isOpen maxWidth="sm" onSubmit={handleSubmit}>
      <div className={css('form', styles, null)}>
        {shapeType && (
          <>
            <TextField
              required
              label={strings.name}
              type="text"
              value={name}
              onChange={setName}
              error={!!errors.name}
              helperText={errors.name}
            />
            <RoleField required value={role} onChange={setRole} error={!!errors.name} helperText={errors.name} shapeType={shapeType} />
          </>
        )}
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
