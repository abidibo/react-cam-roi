import { useContext } from "react"
import { FieldProps } from "../../Types"
import { UiContext } from "../../Providers/UiProvider"
import { css } from "../../Utils"
import styles from './BoolField.module.css'

const BoolField: React.FC<Omit<FieldProps<boolean>, 'onChange'> & { onChange: (value: boolean) => void }> = ({
  onChange,
  value,
  label,
  helperText,
  error,
  readOnly = false,
  disabled = false,
  required = false,
}) => {
  const { themeMode, Typography } = useContext(UiContext)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <div className={css('bool-field-wrapper', styles, themeMode)}>
      <label
        className={`${css('bool-field-label', styles, themeMode)} ${error ? css('bool-field-label-error', styles, null) : ''}`}
      >
        <Typography>{label}{required && ' *'}</Typography>
      </label>
      <input
        type={'checkbox'}
        className={`${css('bool-field', styles, themeMode)} ${error ? css('bool-field-error', styles, null) : ''}`}
        onChange={handleChange}
        checked={value}
        readOnly={readOnly}
        disabled={disabled}
      />
      {helperText && (
        <Typography
          component={'div'}
          className={`${css('bool-field-helper-text', styles, themeMode)} ${error ? css('bool-field-helper-text-error', styles, null) : ''}`}
        >
          {helperText}
        </Typography>
      )}
    </div>
  )
}

export default BoolField
