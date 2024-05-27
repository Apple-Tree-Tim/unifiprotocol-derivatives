import React, { useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DoneAll } from '@material-ui/icons'
import BottomButton from 'Components/BottomButton'
import { Icon } from 'Components/Icon'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { localiseNumber } from 'Utils/BigNumber'
import { useTranslation } from 'react-i18next'

import './DepositSuccessful.scss'

const DepositSuccessful: React.FC = () => {
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
    <div className="DepositSuccessful">
      <h1>{t('deposit-successful.title')}</h1>
      <span className="DepositSuccessful__icon">
        <DoneAll />
      </span>

      {expectedOutput && (
        <>
          <div className="DepositSuccessful__summary ">
            {expectedOutput.movements.deposited!.map((deposit, i) => (
              <div key={i} className="summary-detail">
                <span className="summary-detail__logo">
                  <Icon icon={deposit.name} />
                </span>
                <span className="summary-detail__reward">
                  <span className="summary-detail__reward__flow">
                    {t('deposit-successful.deposited')}
                  </span>
                  <h2>
                    {localiseNumber(deposit.value)} {deposit.name}
                  </h2>
                </span>
              </div>
            ))}
          </div>

          <div className="DepositSuccessful__blockchain-explorer">
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
          label={t('deposit-successful.deposit-more')}
          onClick={() => history.push('/liquidity/pool')}
        />
      </div>
    </div>
  )
}

export { DepositSuccessful }
