import React from 'react'
import { useHistory } from 'react-router-dom'
import { KeyboardArrowLeft } from '@material-ui/icons'

import './Back.scss'

export const Back: React.FC = () => {
  const history = useHistory()

  return (
    <div className="Back" onClick={() => history.goBack()}>
      <KeyboardArrowLeft />
    </div>
  )
}
