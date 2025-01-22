type PointerIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PointerIcon: React.FC<PointerIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <path
        fill={color}
        d="M13.3891,20.923l-3.1995-6.8869-3.47,4.8454V4.077l11.5606,9.0859h-5.9695l3.1679,6.7828-2.0893.9773h-.0002Z"
      />
    </svg>
  )
}

export default PointerIcon
