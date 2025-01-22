type RectangleIconProps = {
  color?: string
  style?: React.CSSProperties
}

const RectangleIcon: React.FC<RectangleIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <path
        fill={color}
        d="M19.5541,7.0738h3.2558v2.1705h-3.2558v3.2558h-2.1705v-3.2558h-3.2558v-2.1705h3.2558v-3.2558h2.1705v3.2558M17.3836,19.0115v-3.2558h2.1705v5.4263H2.1901V7.0738h8.682v2.1705h-6.5115v9.7673h13.023,0Z"
      />
    </svg>
  )
}

export default RectangleIcon
