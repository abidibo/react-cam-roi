import { useContext } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { OperatorEnum } from './Types'
import { formatString, humanize } from '../../Utils'

const RoisInfo = () => {
  const { strings, Typography } = useContext(UiContext)
  const { configuration } = useEditorContext()

  if (!configuration.rois?.length) return null

  return (
    <div>
      <Typography component="div">{strings.roisToBeDrawn}:</Typography>
      <ul>
        {configuration.rois.map(r => {
          let rule: string
          const data = {
            role: humanize(r.role),
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
          <li key={r.role}>{rule}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default RoisInfo
