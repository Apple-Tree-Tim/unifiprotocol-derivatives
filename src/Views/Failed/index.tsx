import React from 'react'
import { useHistory } from 'react-router-dom'
import { ErrorOutline } from '@material-ui/icons'
import BottomButton from 'Components/BottomButton'
import { useTranslation } from 'react-i18next'

import './Failed.scss'

const Failed: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation()

  return (
    <div className="Failed-Wrapper">
      <div className="Failed">
        <h1>{t('transaction-failed.title')}</h1>
        <span className="Failed__icon">
          <ErrorOutline />
        </span>
      </div>
      <div className="Wrapper-Bottom-Button">
        <BottomButton
          label={t('transaction-failed.back')}
          onClick={() => history.goBack()}
        />
      </div>
    </div>
  )
}
export { Failed }
