import React from 'react'
import BottomButton from './index'
import { useHistory } from 'react-router-dom'

export const BottomButtonBack: React.FC = () => {
  const history = useHistory()
  return <BottomButton label="Back" onClick={() => history.push('/')} />
}
