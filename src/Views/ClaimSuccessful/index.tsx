import React, { useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DoneAll } from '@material-ui/icons'
import BottomButton from 'Components/BottomButton'
import { Icon } from 'Components/Icon'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { localiseNumber } from 'Utils/BigNumber'
import { useTranslation } from 'react-i18next'

import './ClaimSuccessful.scss'

const ClaimSuccessful: React.FC = () => {
  const history = useHistory()
  const { txHash } = useParams()
  const { getExpectedTransactionByHash, getExplorerLink } = useTransactions()
  const { t } = useTranslation()

  const expectedOutput = useMemo(() => {
    if (txHash) {
      return getExpectedTransactionByHash(txHash)
    }
    return undefined
  }, [txHash, getExpectedTransactionByHash])

  return (
    <div className="ClaimSuccessful">
      <h1>{t('claim-successful.title')}</h1>
      <span className="ClaimSuccessful__icon">
        <DoneAll />
      </span>

      {expectedOutput && (
        <>
          <div className="RemovePoolSuccessful__summary summary-detail">
            <span className="summary-detail__logo">
              <Icon icon={expectedOutput.movements.received!.name} />
            </span>
            <span className="summary-detail__reward">
              <span className="summary-detail__reward__flow">
                {t('claim-successful.received')}
              </span>
              <h2>
                {localiseNumber(expectedOutput.movements.received!.value)}{' '}
                {expectedOutput.movements.received!.name}
              </h2>
            </span>
          </div>
          <div className="RemovePoolSuccessful__blockchain-explorer">
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
          label={t('claim-successful.claim-more')}
          onClick={() => history.push('/liquidity/claim-rewards')}
        />
      </div>
    </div>
  )
}

export { ClaimSuccessful }
