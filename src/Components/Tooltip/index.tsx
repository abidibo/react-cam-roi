type TooltipProps = {
  title: string
  children: React.ReactElement<unknown, any>
}
const Tooltip: React.FC<TooltipProps> = ({ title, children }) => <div title={title}>{children}</div>

export default Tooltip
