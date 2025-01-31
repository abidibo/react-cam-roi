/* eslint-disable @typescript-eslint/no-explicit-any */
export type TypographyProps = {
  children?: React.ReactNode
  className?: string
  variant?: any // any to support material typography without going crazy with types
  component?: any // any to support material typography without going crazy with types
}
const Typography: React.FC<TypographyProps> = ({ children, className='', component }) => {
  const Tag = component as keyof JSX.IntrinsicElements
  return <Tag className={className}>{children}</Tag>
}

export default Typography
