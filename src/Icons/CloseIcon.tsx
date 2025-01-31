type CloseIconProps = {
  color?: string
  style?: React.CSSProperties
}

const CloseIcon: React.FC<CloseIconProps> = ({ color = 'black', style = {} }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style={style}>
      <path
        fill={color}
        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
      />
    </svg>
  )
}

export default CloseIcon
