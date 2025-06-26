export interface FieldProps<T> {
  onChange: (value: T | null) => void
  value: T
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
}
