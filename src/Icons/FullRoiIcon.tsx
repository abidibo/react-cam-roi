type FullRoiIconProps = {
  color?: string
  style?: React.CSSProperties
}

const FullRoiIcon: React.FC<FullRoiIconProps> = ({ color = 'black', style = { height: '23px' } }) => {
  return (
    <svg style={style} id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18">
      <polyline
        fill={color}
        points="12.0852 7.9148 15.341 7.9148 15.341 10.0852 12.0852 10.0852 12.0852 13.341 9.9148 13.341 9.9148 10.0852 6.659 10.0852 6.659 7.9148 9.9148 7.9148 9.9148 4.659 12.0852 4.659 12.0852 7.9148"
      />
      <polygon fill={color} points="0 18 0 13 2 13 2 16 5 16 5 18 0 18" />
      <polygon fill={color} points="17 18 17 16 20 16 20 13 22 13 22 18 17 18" />
      <polygon fill={color} points="0 5 0 0 5 0 5 2 2 2 2 5 0 5" />
      <polygon fill={color} points="20 5 20 2 17 2 17 0 22 0 22 5 20 5" />
    </svg>
  )
}

export default FullRoiIcon
