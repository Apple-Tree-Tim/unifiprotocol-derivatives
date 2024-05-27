import React from 'react'
import BottomButton from 'Components/BottomButton'
import { ReportProblemOutlined } from '@material-ui/icons'
import { useConfig } from '../../Stores/Config/useConfig'
import { useTranslation, Trans } from 'react-i18next'

import './Warning.scss'

const Warning: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="Warning">
      <div className="Warning__header">
        <ReportProblemOutlined />
        <span>
          <h1>{t('derivatives-warning.title')}</h1>
          <p>{t('derivatives-warning.p-1')}</p>

          <p>
            <Trans i18nKey="derivatives-warning.p-2">
              Please read them in our{' '}
              <a
                href="https://unifiprotocol.zendesk.com/knowledge/articles/360051345712/en-us?brand_id=360004388751"
                target="_blank"
                rel="noopener noreferrer"
              >
                Help Center
              </a>
              . You are agreeing that you are aware of the risks of trading
              derivative tokens on uTrade.
            </Trans>
          </p>
        </span>
      </div>

      <div className="Wrapper-Bottom-Button">
        <SubmitWarningButton />
      </div>
    </div>
  )
}

const SubmitWarningButton = () => {
  const { t } = useTranslation()
  const { acceptAgreement } = useConfig()

  const callback = () => {
    acceptAgreement()
  }

  return (
    <BottomButton label={t('derivatives-warning.accept')} onClick={callback} />
  )
}

export { Warning }
