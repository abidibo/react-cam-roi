import { useContext, useEffect, useState } from 'react'

import { UiContext } from '../../../Providers/UiProvider'
import { compose, css, defaultTo } from '../../../Utils'
import Dispatcher from '../../../Utils/Dispatcher'
import RoleField from '../../RoleField'
import { useParametersForm } from '../Hooks'
import ParameterField from '../ParameterField'
import { ConfigurationParameter, OutputParameter, ShapeType } from '../Types'
import { validateParametersForm } from '../Utils'
import styles from './ParametersModalForm.module.css'

export type ParametersModalFormProps = {
  onClose: () => void
  title: string
  parameters?: ConfigurationParameter[]
  rolesParameters?: Record<string, ConfigurationParameter[]>
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
  rolesParameters,
  data,
  onSubmit,
  shapeType,
  shapeName,
  shapeRole,
  noModal,
  readOnly,
}) => {
  const { Modal, TextField, strings, themeMode, Typography } = useContext(UiContext)
  const [name, setName] = useState(shapeName ?? '')
  const [role, setRole] = useState(shapeRole ?? '')
  const { fields, setField, errors, setErrors, resetErrors, reset } = useParametersForm(data)
  const readonlyFields: Record<string, unknown> = data.reduce((acc, p) => ({ ...acc, [p.codename]: p.value }), {})

  // if not in modal we save at every field change
  useEffect(() => {
    if (noModal) {
      handleSubmit()
    }
  }, [fields])

  const currentParameters = shapeType
    ? defaultTo<ConfigurationParameter[]>([])(rolesParameters?.[role])
    : defaultTo<ConfigurationParameter[]>([])(parameters)

  // add a listener in order for general save to call validate
  useEffect(() => {
    const validate = () => {
      validateParametersForm(currentParameters, fields, setErrors, resetErrors)
    }
    Dispatcher.register('editor:save', validate)
    return () => {
      Dispatcher.unregister('editor:save', validate)
    }
  }, [currentParameters, fields, setErrors, resetErrors])

  const handleSubmit = () => {
    if (shapeType && name === '') {
      setErrors({ name: strings.requiredField })
    } else if (noModal || validateParametersForm(currentParameters, fields, setErrors, resetErrors)) {
      const data = [
        ...currentParameters.map((p) => ({ codename: p.codename, value: fields[p.codename] })),
      ] as OutputParameter[]
      if (shapeType) {
        onSubmit(data, { name, role })
      } else {
        onSubmit(data)
      }
    }
  }

  // group parameters by fieldset
  const groupedParameters = currentParameters.reduce(
    (acc, p) => {
      if (acc[p.fieldSet || '']) {
        acc[p.fieldSet || ''].push(p)
      } else {
        acc[p.fieldSet || ''] = [p]
      }
      return acc
    },
    {} as Record<string, ConfigurationParameter[]>,
  )

  const form = (
    <div className={css('form', styles, null)}>
      {shapeType && (
        <>
          <TextField
            required
            label={strings.name}
            type="text"
            value={name}
            onChange={compose(setName, defaultTo(''))}
            error={!!errors.name}
            helperText={errors.name}
            readOnly={readOnly}
          />
          <RoleField
            required
            value={role}
            onChange={compose(reset, setRole, defaultTo(''))}
            error={!!errors.role}
            helperText={errors.role}
            shapeType={shapeType}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </>
      )}
      {[
        ...Object.keys(groupedParameters).filter((k) => k === ''),
        ...Object.keys(groupedParameters).filter((k) => k !== ''),
      ].map((fieldSet) => (
        <div className={css('fieldset', styles, themeMode)} key={fieldSet}>
          {fieldSet && (
            <Typography component="div" className={css('legend', styles, themeMode)}>
              {fieldSet}
            </Typography>
          )}
          {groupedParameters[fieldSet].map((parameter: ConfigurationParameter) => {
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
                  <ParameterField<number | null>
                    key={parameter.codename}
                    value={
                      (readOnly ? readonlyFields : fields)[parameter.codename] === ''
                        ? null
                        : ((readOnly ? readonlyFields : fields)[parameter.codename] as number)
                    }
                    onChange={setField<number | null>(parameter.codename)}
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
      ))}
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
