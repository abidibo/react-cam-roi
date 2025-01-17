type PolygonIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PolygonIcon: React.FC<PolygonIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.7123 21.7123">
      <path
        fill={color}
        d="M15.9985,15.6557v-3.0854h2.2855v4.571l-10.2848,4.571L0,13.713,4.571,3.4283h4.571v2.2855h-3.0854l-3.314,7.5422,5.7138,5.7138,7.5422-3.314M21.7123,3.4283v2.2855h-3.4283v3.4283h-2.2855v-3.4283h-3.4283v-2.2855h3.4283V0h2.2855v3.4283h3.4283Z"
      />
    </svg>
  )
}

export default PolygonIcon
