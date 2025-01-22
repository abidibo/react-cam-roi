type SelectIconProps = {
  color?: string
  style?: React.CSSProperties
}

const SelectIcon: React.FC<SelectIconProps> = ({ color = 'black', style = {} }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style={style}>
      <path
        fill={color}
        d="m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z"
      />
    </svg>
  )
}

export default SelectIcon
