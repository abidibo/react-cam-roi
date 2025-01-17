type PolylineIconProps = {
  color?: string
  style?: React.CSSProperties
}

const PolylineIcon: React.FC<PolylineIconProps> = ({ color = 'black', style = { height: '32px' } }) => {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.435 20.2621">
      <polygon
        fill={color}
        points="21.0829 5.8391 21.0829 2.487 18.8481 2.487 18.8481 5.8391 15.4961 5.8391 15.4961 8.0739 18.8481 8.0739 18.8481 11.426 21.0829 11.426 21.0829 8.0739 24.435 8.0739 24.435 5.8391 21.0829 5.8391"
      />
      <polygon
        fill={color}
        points="12.4979 15.4673 6.4898 12.3962 6.4898 9.0033 8.6631 6.4898 13.4066 6.4898 13.4066 0 6.9169 0 6.9169 4.7717 3.9691 8.1811 0 8.1811 0 14.6709 5.5695 14.6709 12.4979 18.2121 12.4979 20.2621 18.9877 20.2621 18.9877 13.7723 12.4979 13.7723 12.4979 15.4673"
      />
    </svg>
  )
}

export default PolylineIcon
