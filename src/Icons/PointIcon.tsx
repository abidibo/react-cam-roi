type PointIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PointIcon: React.FC<PointIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9.5" cy="15.5" r="4.5" fill={color} />
      <path
        d="M19.5 0 L21.5 0 L21.5 3.5 L25 3.5 L25 5.5 L21.5 5.5 L21.5 9 L19.5 9 L19.5 5.5 L16 5.5 L16 3.5 L19.5 3.5 Z"
        stroke={color}
        stroke-width=".6"
        fill={color}
      />
    </svg>
  )
}

export default PointIcon
