import { Configuration } from "./Types";

export const enableRois = (configuration: Configuration): boolean => {
  return configuration.rois.length > 0
}
