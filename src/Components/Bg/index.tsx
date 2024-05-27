import React from 'react'

import './Bg.scss'

export const Bg: React.FC = () => {
  return (
    <div className="Bg">
      <div className="Bg__skew-1"></div>
      <div className="Bg__blocks"></div>
      <div className="Bg__skew-2"></div>
    </div>
  )
}
