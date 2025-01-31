import { Configuration, INotify, OperatorEnum, Shapes, ToolEnum } from './Types'

export const notify: INotify = {
  info: (message: string) => alert(`Info: ${message}`),
  warn: (message: string) => alert(`Warning: ${message}`),
  error: (message: string) => alert(`Error: ${message}`),
  success: (message: string) => alert(`Success: ${message}`),
}

export const enableRois = (configuration: Configuration): boolean => {
  return configuration.rois.length > 0
}

export const canDrawShape = (
  configuration: Configuration,
  shapeType: Omit<ToolEnum, ToolEnum.Pointer>,
  shapes: Shapes,
  notify: INotify,
  message: string,
): boolean => {
  const rule = configuration.rois.find((roi) => roi.type === shapeType)

  // no rule
  if (!rule || !rule.multiplicity || Object.keys(rule.multiplicity).length === 0) {
    return true
  }

  const currentShapeCount = Object.values(shapes).filter((s) => s.type === shapeType).length

  let res = true
  switch (rule.multiplicity.operator) {
    case OperatorEnum.Eq:
    case OperatorEnum.Lte:
      res = currentShapeCount + 1 <= rule.multiplicity.threshold
      break
    case OperatorEnum.Lt:
      res = currentShapeCount + 1 < rule.multiplicity.threshold
      break
    default:
      return true
  }

  if (!res && notify) {
    notify.warn(message)
  }

  return res
}
