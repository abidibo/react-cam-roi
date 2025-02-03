import { useContext } from "react"
import { ConfigurationParameter } from "./Types"
import { UiContext } from "../../Providers/UiProvider"

export type ParameterFieldProps<T> = {
  value: T,
  onChange: (value: T) => void
  parameter: ConfigurationParameter
}
const ParameterField = <T,>({ value, onChange, parameter }: ParameterFieldProps<T>) => {
  const { TextField, NumberField, BoolField } = useContext(UiContext)

  const props = {
    required: parameter.required,
    label: `${parameter.label}${parameter.unit ? ` (${parameter.unit})` : ''}`,
    helperText: parameter.description
  }

  switch (parameter.type) {
    case 'string':
      return (
        <TextField
          type="text"
          value={value as string}
          onChange={(v) => onChange(v as T)}
          {...props}
        />
      )
    case 'int':
    case 'float':
      return (
        <NumberField
          value={value as number}
          onChange={(v) => onChange(v as T)}
          {...props}
        />
      )
    case 'bool':
      return (
        <BoolField
          value={value as boolean}
          onChange={(v) => onChange(v as T)}
          {...props}
        />
      )
    default:
      return null
  }
}

export default ParameterField
