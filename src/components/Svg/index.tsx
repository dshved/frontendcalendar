import * as React from 'react'

interface SvgType {
  children: React.ReactChild
  width: string
  height: string
  className?: string
}

const Svg = ({children, width, height, className}: SvgType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    className={className}
    role="presentation">
    {children}
  </svg>
)

export default Svg
