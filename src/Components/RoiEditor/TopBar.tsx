import { useContext, useState } from 'react'

import SaveIcon from '../../Icons/SaveIcon'
import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import ParametersModalForm from './ParametersModalForm'
import styles from './TopBar.module.css'
import { OutputParameter } from './Types'
import { enableMainMetadata } from './Utils'

const TopBar = () => {
  const { themeMode, AnnotateIcon, Button, primaryFgColor, strings } = useContext(UiContext)
  const { configuration, onSubmit, metadata, setMetadata } = useEditorContext()
  const [form, setForm] = useState<{ isOpen: boolean }>({ isOpen: false })

  const iconColor = themeMode === 'light' ? 'black' : 'white'

  const handleSubmitMetadata = (data: OutputParameter[]) => {
    setMetadata({
      ...metadata,
      parameters: data,
    })
    console.log('SAVE', {
      parameters: data,
    }) // eslint-disable-line
    setForm({ isOpen: false })
  }

  return (
    <>
      <div className={css('top-bar', styles, themeMode)}>
        {enableMainMetadata(configuration) && !configuration.options?.viewMainParameters && (
          <Button onClick={() => setForm({ isOpen: true })}>
            <AnnotateIcon color={iconColor} /> {strings.mainParametersMetadata}
          </Button>
        )}
        <Button primary onClick={onSubmit}>
          <SaveIcon color={primaryFgColor} /> {strings.save}
        </Button>
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
      {configuration.options?.viewMainParameters && (
        <div className={css('main-parameters-view', styles, themeMode)}>
          <div className={css('main-parameters-button', styles, themeMode)}>
            <Button onClick={() => setForm({ isOpen: true })}>
              <AnnotateIcon color={iconColor} /> {strings.mainParametersMetadata}
            </Button>
          </div>
          <ParametersModalForm
            parameters={configuration.parameters}
            data={metadata.parameters}
            title={strings.mainParametersMetadata}
            onClose={() => setForm({ isOpen: false })}
            onSubmit={handleSubmitMetadata}
            readOnly
            noModal
          />
        </div>
      )}
    </>
  )
}

export default TopBar
