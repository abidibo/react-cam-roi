import { useContext, useState } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import { enableMainMetadata } from './Utils'
import SaveIcon from '../../Icons/SaveIcon'
import ParametersModalForm from './ParametersModalForm'
import { OutputParameter } from './Types'
import styles from './TopBar.module.css'

const TopBar = () => {
  const { themeMode,  AnnotateIcon, Button, primaryFgColor, strings } = useContext(UiContext)
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
    <div className={css('top-bar', styles, themeMode)}>
      {enableMainMetadata(configuration) && (
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
  )
}

export default TopBar
