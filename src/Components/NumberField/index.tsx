import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './NumberField.module.css'

export type NumberFieldProps = {
  onChange: (value: number) => void
  value: number
  label: string
  helperText?: string
  error?: boolean
}

const NumberField: React.FC<NumberFieldProps> = ({ onChange, value, label, helperText, error }) => {
  const { themeMode, Typography } = useContext(UiContext)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }

  return (
    <div className={css('number-field-wrapper', styles, themeMode)}>
      <label
        className={`${css('number-field-label', styles, themeMode)} ${error ? css('number-field-label-error', styles, null) : ''}`}
      >
        <Typography>{label}</Typography>
      </label>
      <input
        type={'number'}
        className={`${css('number-field', styles, themeMode)} ${error ? css('number-field-error', styles, null) : ''}`}
        onChange={handleChange}
        value={value}
      />
      {helperText && (
        <Typography
          component={'div'}
          className={`${css('number-field-helper-text', styles, themeMode)} ${error ? css('number-field-helper-text-error', styles, null) : ''}`}
        >
          {helperText}
        </Typography>
      )}
    </div>
  )
}

export default NumberField
