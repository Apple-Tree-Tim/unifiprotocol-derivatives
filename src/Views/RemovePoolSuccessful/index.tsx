import React, { useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DoneAll } from '@material-ui/icons'
import BottomButton from 'Components/BottomButton'
import { Icon } from 'Components/Icon'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { localiseNumber } from 'Utils/BigNumber'
import { Config } from 'Config'
import { useTranslation } from 'react-i18next'

import './RemovePoolSuccessful.scss'

const RemovePoolSuccessful: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { contractAddress, txHash } = useParams()
  const { getExpectedTransactionByHash, getExplorerLink } = useTransactions()

  const expectedOutput = useMemo(() => {
    if (txHash) {
      return getExpectedTransactionByHash(txHash)
    }
    return undefined
  }, [txHash, getExpectedTransactionByHash])

  const pairConfig = useMemo(() => {
    return Config.pairs.find((p) => p.contractAddress === contractAddress)
  }, [contractAddress])

  return (
    <div className="RemovePoolSuccessful">
      <h1>
        {t('remove-pool-successful.title', {
          token: pairConfig ? pairConfig.token : 'uToken'
        })}
      </h1>
      <span className="RemovePoolSuccessful__icon">
        <DoneAll />
      </span>

      {expectedOutput && (
        <>
          <div className="RemovePoolSuccessful__summary">
            {expectedOutput.movements.withdrawn!.map((withdraw, i) => (
              <div key={i} className="summary-detail">
                <span className="summary-detail__logo">
                  <Icon icon={withdraw.name} />
                </span>
                <span className="summary-detail__reward">
                  <span className="summary-detail__reward__flow">
                    {t('remove-pool-successful.received')}
                  </span>
                  <h2>
                    {localiseNumber(withdraw.value)} {withdraw.name}
                  </h2>
                </span>
              </div>
            ))}
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
          label={t('remove-pool-successful.withdraw-more')}
          onClick={() => history.push('/liquidity/remove-pool')}
        />
      </div>
    </div>
  )
}

export { RemovePoolSuccessful }
