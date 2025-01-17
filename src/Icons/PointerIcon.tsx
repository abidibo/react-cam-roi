type PointerIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PointerIcon: React.FC<PointerIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} fill={color} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
      <path d="m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z" />
    </svg>
  )
}

export default PointerIcon
