import { useContext } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { formatString } from '../../Utils'
import { OperatorEnum } from './Types'

const RoisInfo = () => {
  const { strings, Typography, TextField } = useContext(UiContext)
  const { configuration, presetName, setPresetName, presetDescription, setPresetDescription } = useEditorContext()

  if (!configuration.rois?.length) return null

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <TextField required value={presetName} onChange={setPresetName} label={strings.presetName} fullWidth />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          value={presetDescription}
          onChange={setPresetDescription}
          label={strings.presetDescription}
          fullWidth
        />
      </div>
      {configuration.options?.description && <Typography>{configuration.options.description}</Typography>}
      <Typography component="div">{strings.roisToBeDrawn}:</Typography>
      <ul>
        {configuration.rois.map((r) => {
          let rule: string
          const data = {
            role: r.label,
            type: r.type as string,
            threshold: r.multiplicity?.threshold,
          }
          switch (r.multiplicity?.operator) {
            case OperatorEnum.Eq:
              rule = formatString(strings.roiMultiplicityEqRule, data)
              break
            case OperatorEnum.Lt:
              rule = formatString(strings.roiMultiplicityLtRule, data)
              break
            case OperatorEnum.Lte:
              rule = formatString(strings.roiMultiplicityLteRule, data)
              break
            case OperatorEnum.Gt:
              rule = formatString(strings.roiMultiplicityGtRule, data)
              break
            case OperatorEnum.Gte:
              rule = formatString(strings.roiMultiplicityGteRule, data)
              break
            default:
              rule = formatString(strings.roiMultiplicityNoRule, data)
          }
          return (
            <li key={r.role}>
              <Typography>{rule}</Typography>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RoisInfo
