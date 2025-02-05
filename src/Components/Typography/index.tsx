/* eslint-disable @typescript-eslint/no-explicit-any */
export type TypographyProps = {
  children?: React.ReactNode
  className?: string
  variant?: any // any to support material typography without going crazy with types
  component?: any // any to support material typography without going crazy with types
  style?: React.CSSProperties
}
const Typography: React.FC<TypographyProps> = ({ children, style = {}, className = '', component = 'span' }) => {
  const Tag = component as keyof JSX.IntrinsicElements
  return <Tag className={className} style={style}>{children}</Tag>
}

export default Typography
