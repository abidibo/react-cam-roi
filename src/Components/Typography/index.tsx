export type TypographyProps = {
  children?: React.ReactNode
}
const Typography: React.FC<TypographyProps> = ({ children }) => {
  return <span>{children}</span>
}

export default Typography
