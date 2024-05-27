import React from 'react'
import LanguageSelector from '../LanguageSelector'

import './TopHeader.scss'

const TopHeader: React.FC = () => {
  return (
    <div className="TopHeader hide-for-mobile">
      <span></span>
      <span>
        <span
          className="TopHeader-Button"
          onClick={() => {
            window.location.href = `https://${window.location.host}/`
          }}
        >
          Regular Market
        </span>
        <LanguageSelector />
      </span>
    </div>
  )
}

export default TopHeader
