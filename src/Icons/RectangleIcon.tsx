type RectangleIconProps = {
  color?: string
  style?: React.CSSProperties
}

const RectangleIcon: React.FC<RectangleIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.7123 18.284">
      <path
        fill={color}
        d="M18.284,3.4283h3.4283v2.2855h-3.4283v3.4283h-2.2855v-3.4283h-3.4283v-2.2855h3.4283V0h2.2855v3.4283M15.9985,15.9985v-3.4283h2.2855v5.7138H0V3.4283h9.142v2.2855H2.2855v10.2848h13.713Z"
      />
    </svg>
  )
}

export default RectangleIcon
