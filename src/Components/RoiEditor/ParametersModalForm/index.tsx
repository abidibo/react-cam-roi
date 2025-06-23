import { useContext, useEffect, useState } from 'react'

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
  onSubmit: (data: OutputParameter[], properties?: { name: string; role: string }) => void
  shapeType?: ShapeType
  shapeName?: string
  shapeRole?: string
  shapeId?: string
  readOnly?: boolean
  noModal?: boolean
}

const ParametersModalForm: React.FC<ParametersModalFormProps> = ({
  title,
  onClose,
  parameters,
  data,
  onSubmit,
  shapeType,
  shapeName,
  shapeRole,
  noModal,
  readOnly,
}) => {
  const { Modal, TextField, strings } = useContext(UiContext)
  const [name, setName] = useState(shapeName ?? '')
  const [role, setRole] = useState(shapeRole ?? '')
  const { fields, setField, errors, setErrors } = useParametersForm(data)
  const readonlyFields: Record<string, unknown> = data.reduce((acc, p) => ({ ...acc, [p.codename]: p.value }), {})

  // if not in modal we save at every field change
  useEffect(() => {
    if (noModal) {
      handleSubmit()
    }
  }, [fields])

  const handleSubmit = () => {
    if (shapeType && name === '') {
      setErrors({ name: strings.requiredField })
    } else if (!noModal || validateParametersForm(parameters, fields, setErrors, strings)) {
      const data = [
        ...parameters.map((p) => ({ codename: p.codename, value: fields[p.codename] })),
      ] as OutputParameter[]
      if (shapeType) {
        onSubmit(data, { name, role })
      } else {
        onSubmit(data)
      }
    }
  }

  const form = (
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
            readOnly={readOnly}
          />
          <RoleField
            required
            value={role}
            onChange={setRole}
            error={!!errors.role}
            helperText={errors.role}
            shapeType={shapeType}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </>
      )}
      {parameters.map((parameter: ConfigurationParameter) => {
        switch (parameter.type) {
          case 'string':
            return (
              <ParameterField<string>
                key={parameter.codename}
                value={String((readOnly ? readonlyFields : fields)[parameter.codename])}
                onChange={setField<string>(parameter.codename)}
                parameter={parameter}
                errors={errors}
                readOnly={readOnly}
              />
            )
          case 'int':
          case 'float':
            return (
              <ParameterField<number>
                key={parameter.codename}
                value={(readOnly ? readonlyFields : fields)[parameter.codename] as number}
                onChange={setField<number>(parameter.codename)}
                parameter={parameter}
                errors={errors}
                readOnly={readOnly}
              />
            )
          case 'bool':
            return (
              <ParameterField<boolean>
                key={parameter.codename}
                value={(readOnly ? readonlyFields : fields)[parameter.codename] as boolean}
                onChange={setField<boolean>(parameter.codename)}
                parameter={parameter}
                errors={errors}
                readOnly={readOnly}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )

  return noModal ? (
    form
  ) : (
    <Modal onClose={onClose} title={title} isOpen maxWidth="sm" onSubmit={handleSubmit}>
      {form}
    </Modal>
  )
}

export default ParametersModalForm
