import React from 'react'
import Button from '../Button'

import './BottomButton.scss'

const BottomButton: React.FC<{
  label: string
  onClick?: () => void
  options?: {
    disabled?: boolean
  }
}> = ({ label, onClick, options = {} }) => {
  return (
    <div className="BottomButton">
      <Button onClick={onClick} disabled={options.disabled}>
        {label}
      </Button>
    </div>
  )
}

export default BottomButton
