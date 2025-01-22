type PolygonIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PolygonIcon: React.FC<PolygonIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <path
        fill={color}
        d="M17.3836,17.058v-2.9301h2.1705v4.341l-9.7673,4.341-7.5967-7.5968L6.5311,5.4459h4.341v2.1705h-2.9301l-3.1472,7.1627,5.4263,5.4263,7.1627-3.1472M22.8099,5.4459v2.1705h-3.2558v3.2558h-2.1705v-3.2558h-3.2558v-2.1705h3.2558v-3.2558h2.1705v3.2558h3.2558Z"
      />
    </svg>
  )
}

export default PolygonIcon
