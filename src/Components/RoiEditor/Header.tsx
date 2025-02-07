import { useContext, useState } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Header.module.css'
import ParametersModalForm from './ParametersModalForm'
import { OutputParameter } from './Types'
import { enableMainMetadata } from './Utils'
import RoisInfo from './RoisInfo'

const Header = () => {
  const { themeMode, Typography, Button, strings, SaveIcon, primaryFgColor, AnnotateIcon } =
    useContext(UiContext)
  const { configuration, onSubmit, metadata, setMetadata } = useEditorContext()
  const [form, setForm] = useState<{ isOpen: boolean }>({ isOpen: false })

  const iconColor = themeMode === 'light' ? 'black' : 'white'

  const handleSubmitMetadata = (data: OutputParameter[]) => {
    setMetadata({
      ...metadata,
      parameters: data,
    })
    setForm({ isOpen: false })
  }

  return (
    <div className={css('header', styles, themeMode)}>
      <div className={css('header-info', styles, themeMode)}>
        {configuration.options?.description && <Typography>{configuration.options.description}</Typography>}
        <RoisInfo />
      </div>
      <div className={styles.headerButtons}>
        {enableMainMetadata(configuration) && (
          <Button onClick={() => setForm({ isOpen: true })}>
            <AnnotateIcon color={iconColor} /> {strings.mainParametersMetadata}
          </Button>
        )}
        <Button primary onClick={onSubmit}>
          <SaveIcon color={primaryFgColor} /> {strings.save}
        </Button>
      </div>
      {form.isOpen && (
        <ParametersModalForm
          parameters={configuration.parameters}
          data={metadata.parameters}
          title={strings.mainParametersMetadata}
          onClose={() => setForm({ isOpen: false })}
          onSubmit={handleSubmitMetadata}
        />
      )}
    </div>
  )
}

export default Header
