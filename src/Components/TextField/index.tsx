import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './TextField.module.css'

export type TextFieldProps = {
  type?: 'text' | 'email' | 'password'
  onChange: (value: string) => void
  value: string
  label: string
  helperText?: string
  error?: boolean
}

const TextField: React.FC<TextFieldProps> = ({ onChange, type = 'text', value, label, helperText, error }) => {
  const { themeMode, Typography } = useContext(UiContext)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={css('text-field-wrapper', styles, themeMode)}>
      <label
        className={`${css('text-field-label', styles, themeMode)} ${error ? css('text-field-label-error', styles, null) : ''}`}
      >
        <Typography>{label}</Typography>
      </label>
      <input
        type={type}
        className={`${css('text-field', styles, themeMode)} ${error ? css('text-field-error', styles, null) : ''}`}
        onChange={handleChange}
        value={value as string | number}
      />
      {helperText && (
        <Typography
          component={'div'}
          className={`${css('text-field-helper-text', styles, themeMode)} ${error ? css('text-field-helper-text-error', styles, null) : ''}`}
        >
          {helperText}
        </Typography>
      )}
    </div>
  )
}

export default TextField
