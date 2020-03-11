import React from 'react'
import classNames from 'classnames'

export default function Badge({ color, children, className, custom_color }) {
  const klassNames = classNames(
    'inline-block text-xs leading-none uppercase p-1',
    {
      'bg-red text-white': color === 'red',
      'bg-green text-white': color === 'green',
      'bg-grey-dark text-white': !color
    },
    className
  )
  const customStyle = !custom_color?{}:{"background-color": custom_color}
   
  

  return <span className={klassNames} style={customStyle}>{children}</span>
}
