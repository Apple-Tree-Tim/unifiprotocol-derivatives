import React, { useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DoneAll, ArrowForwardIos } from '@material-ui/icons'
import BottomButton from 'Components/BottomButton'
import { Icon } from 'Components/Icon'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { localiseNumber } from 'Utils/BigNumber'
import { useTranslation } from 'react-i18next'

import './SwapSuccessful.scss'

const SwapSuccessful: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { txHash } = useParams()
  const { getExpectedTransactionByHash, getExplorerLink } = useTransactions()

  const expectedOutput = useMemo(() => {
    if (txHash) {
      return getExpectedTransactionByHash(txHash)
    }
    return undefined
  }, [txHash, getExpectedTransactionByHash])

  return (
    <div className="SwapSuccessful">
      <h1 className="green">{t('trade-successful.title')}</h1>
      <span className="SwapSuccessful__icon">
        <DoneAll />
      </span>

      {expectedOutput && (
        <>
          <div className="SwapSuccessful__summary">
            <div className="SwapSuccessful__summary__send summary-detail">
              <span className="summary-detail__logo">
                <Icon icon={expectedOutput.movements.sent!.name} />
              </span>
              <span className="summary-detail__reward">
                <span className="summary-detail__reward__flow">
                  {t('trade-successful.sent')}
                </span>
                <h2>{localiseNumber(expectedOutput.movements.sent!.value)}</h2>
              </span>
            </div>
            <div className="SwapSuccessful__summary__arrow">
              <ArrowForwardIos />
            </div>
            <div className="SwapSuccessful__summary__received">
              <div className="summary-detail">
                <span className="summary-detail__logo">
                  <Icon icon={expectedOutput.movements.received!.name} />
                </span>
                <span className="summary-detail__reward">
                  <span className="summary-detail__reward__flow">
                    {t('trade-successful.received')}
                  </span>
                  <h2>
                    ≈{localiseNumber(expectedOutput.movements.received!.value)}
                  </h2>
                </span>
              </div>
            </div>
          </div>
          <div className="SwapSuccessful__blockchain-explorer">
            <a
              href={getExplorerLink(txHash)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash}
            </a>
          </div>
        </>
      )}

      <div className="Wrapper-Bottom-Button">
        <BottomButton
          label={t('trade-successful.trade-more')}
          onClick={() => history.push('/')}
        />
      </div>
    </div>
  )
}

export { SwapSuccessful }
