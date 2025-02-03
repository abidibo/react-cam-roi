import { useContext } from "react"
import { ConfigurationParameter } from "./Types"
import { UiContext } from "../../Providers/UiProvider"

export type ParameterFieldProps<T> = {
  value: T,
  onChange: (value: T) => void
  parameter: ConfigurationParameter
}
const ParameterField = <T,>({ value, onChange, parameter }: ParameterFieldProps<T>) => {
  const { TextField } = useContext(UiContext)

  switch (parameter.type) {
    case 'string':
      return (
        <TextField
          type="text"
          label={parameter.label}
          value={value as string}
          onChange={(v) => onChange(v as T)}
          helperText={parameter.description}
        />
      )
    default:
      return null
  }
}

export default ParameterField
