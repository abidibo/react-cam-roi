export interface FieldProps<T> {
  onChange: (value: T) => void
  value: T
  label: string
  helperText?: string
  error?: boolean
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
}
