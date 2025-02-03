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
  const { themeMode } = useContext(UiContext)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={css('text-field-wrapper', styles, themeMode)}>
      <label
        className={`${css('text-field-label', styles, themeMode)} ${error ? styles['text-field-label-error'] : ''}`}
      >
        {label}
      </label>
      <input
        type={type}
        className={`${css('text-field', styles, themeMode)} ${error ? styles['text-field-error'] : ''}`}
        onChange={handleChange}
        value={value as string | number}
      />
      {helperText && (
        <p
          className={`${css('text-field-helper-text', styles, themeMode)} ${error ? styles['text-field-helper-text-error'] : ''}`}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export default TextField
