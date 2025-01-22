type PolylineIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PolylineIcon: React.FC<PolylineIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <polygon
        fill={color}
        points="20.5216 8.6492 20.5216 5.4658 18.3992 5.4658 18.3992 8.6492 15.2159 8.6492 15.2159 10.7715 18.3992 10.7715 18.3992 13.955 20.5216 13.955 20.5216 10.7715 23.705 10.7715 23.705 8.6492 20.5216 8.6492"
      />
      <polygon
        fill={color}
        points="12.3027 17.2 7.011 14.4951 7.011 11.5067 8.9251 9.2929 13.103 9.2929 13.103 3.577 7.3871 3.577 7.3871 7.7797 4.7908 10.7826 1.295 10.7826 1.295 16.4985 6.2004 16.4985 12.3027 19.6175 12.3027 21.423 18.0186 21.423 18.0186 15.7071 12.3027 15.7071 12.3027 17.2"
      />
    </svg>
  )
}

export default PolylineIcon
