
import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { FieldProps } from '../../Types'
import { css } from '../../Utils'
import styles from './EnumField.module.css'

export type EnumOption = {
  value: string | number
  label: string
}
const EnumField = ({
  onChange,
  value,
  label,
  helperText,
  error,
  options,
  disabled = false,
  required = false,
}: Omit<FieldProps<string | number>, 'readOnly'> & { options: EnumOption[] }) => {
  const { themeMode, Typography } = useContext(UiContext)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }
  return (
    <div className={css('enum-field-wrapper', styles, themeMode)}>
      <label
        className={`${css('enum-field-label', styles, themeMode)} ${error ? css('enum-field-label-error', styles, null) : ''}`}
      >
        <Typography>
          {label}
          {required && ' *'}
        </Typography>
      </label>
      <select
        className={`${css('enum-field', styles, themeMode)} ${error ? css('enum-field-error', styles, null) : ''}`}
        onChange={handleChange}
        value={value}
        disabled={disabled}
      >
        {!required && <option value={''}></option>}
        {options.map((option: EnumOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <Typography
          component={'div'}
          className={`${css('enum-field-helper-text', styles, themeMode)} ${error ? css('enum-field-helper-text-error', styles, null) : ''}`}
        >
          {helperText}
        </Typography>
      )}
    </div>
  )
}

export default EnumField
