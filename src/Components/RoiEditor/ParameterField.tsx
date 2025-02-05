import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { ConfigurationParameter } from './Types'

export type ParameterFieldProps<T> = {
  value: T
  onChange: (value: T) => void
  parameter: ConfigurationParameter
  errors: Record<string, string>
}
const ParameterField = <T,>({ value, onChange, parameter, errors }: ParameterFieldProps<T>) => {
  const { TextField, NumberField, BoolField, EnumField, strings } = useContext(UiContext)

  const props = {
    required: parameter.required,
    label: `${parameter.label}${parameter.unit ? ` (${parameter.unit})` : ''}`,
    error: !!errors[parameter.codename],
    helperText: errors[parameter.codename]
      ? strings[errors[parameter.codename] as keyof typeof strings]
      : parameter.description,
  }

  switch (parameter.type) {
    case 'string':
      return parameter.options?.length ? (
        <EnumField
          value={value as string}
          onChange={(v) => onChange(v as T)}
          options={parameter.options}
          multiple={parameter.multiple}
          {...props}
        />
      ) : (
        <TextField type="text" value={value as string} onChange={(v) => onChange(v as T)} {...props} />
      )
    case 'int':
    case 'float':
      return parameter.options?.length ? (
        <EnumField
          value={value as number}
          onChange={(v) => onChange(v as T)}
          options={parameter.options}
          multiple={parameter.multiple}
          {...props}
        />
      ) : (
        <NumberField value={value as number} onChange={(v) => onChange(v as T)} {...props} />
      )
    case 'bool':
      return <BoolField value={value as boolean} onChange={(v) => onChange(v as T)} {...props} />
    default:
      return null
  }
}

export default ParameterField
