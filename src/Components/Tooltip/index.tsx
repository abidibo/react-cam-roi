type TooltipProps = {
  title: string
  children: React.ReactNode
}
const Tooltip: React.FC<TooltipProps> = ({ title, children }) => <div title={title}>{children}</div>

export default Tooltip
