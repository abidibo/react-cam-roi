type PointerIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PointerIcon: React.FC<PointerIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.5768 18.3268">
      <path
        fill={color}
        d="M7.2557,18.3268l-3.4807-7.4922-3.775,5.2713V0l12.5768,9.8845h-6.4942l3.4463,7.379s-2.273,1.0632-2.273,1.0632Z"
      />
    </svg>
  )
}

export default PointerIcon
