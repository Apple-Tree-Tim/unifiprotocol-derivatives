import React, { useCallback, useEffect, useState } from 'react'
import Button from 'Components/Button'
import { Table, TableRow, TableHeader } from 'Components/Table'
import { useHistory } from 'react-router-dom'
import BottomButton from 'Components/BottomButton'
import UnbrandedUnifi from 'Assets/unifi-logo-unbranded.png'
import { useAdapter } from 'Stores/Adapter/useAdapter'
import { Config } from 'Config'
import { ContractMethod } from 'Adapters/Contract'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import BigNumber from 'bignumber.js'
import { useToasts } from 'react-toast-notifications'
import { getPrecision } from 'Utils/Decimals'

import './ClaimRewards.scss'
import { Trans, useTranslation } from 'react-i18next'

const ClaimRewards: React.FC = () => {
  const history = useHistory()
  const { addToast } = useToasts()
  const { execute, adapter } = useAdapter()
  const [claimsDetail, setClaimsDetail] = useState<
    { contractAddress: string; amount: string; token: string }[]
  >([])
  const { addExpectedTransaction } = useTransactions()
  const { t } = useTranslation()

  const updateClaimable = useCallback(async () => {
    if (adapter) {
      for (const contract of Config.pairs) {
        const pendingFee = await execute(
          contract.contractAddress,
          ContractMethod.PENDING_FEE_EARN
        )

        const amount = new BigNumber(pendingFee.value)
          .dividedBy(getPrecision(Config.contracts.UP.address))
          .toFixed()

        const uPair = {
          ...contract,
          amount
        }
        setClaimsDetail((uPairs) => [...uPairs, uPair])
      }
    }
  }, [adapter, execute])

  useEffect(() => {
    if (adapter) {
      updateClaimable()
    }
  }, [adapter, updateClaimable])

  const onClaimClick = useCallback(
    async (detail: typeof claimsDetail[number]) => {
      if (new BigNumber(detail.amount).isZero()) {
        return addToast(<div>{t('claim-rewards.claiming-error')}</div>, {
          appearance: 'info'
        })
      }

      if (adapter) {
        const claimResult = await execute(
          detail.contractAddress,
          ContractMethod.CLAIM_FEE,
          {},
          true
        )

        addExpectedTransaction({
          transaction: claimResult,
          movements: {
            received: {
              name: 'UP',
              value: detail.amount
            }
          }
        })

        if (claimResult.success) {
          history.push(`/liquidity/claim-rewards/success/${claimResult.hash}`)
        } else {
          history.push('/failed')
        }
      }
    },
    [
      t,
      execute,
      adapter,
      history,
      addExpectedTransaction,
      claimsDetail,
      addToast
    ]
  )

  return (
    <div className="ClaimRewards">
      <div className="ClaimRewards__header">
        <img src={UnbrandedUnifi} alt="Unifi" />
        <span>
          <h1>{t('claim-rewards.title')}</h1>
          <p>{t('claim-rewards.p-1')}</p>
          <p>
            <Trans i18nKey="for-more-info-press-here">
              For more information press{' '}
              <a
                href="https://unifiprotocol.zendesk.com/hc/en-us"
                title="more information"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </Trans>
          </p>
        </span>
      </div>

      <div className="ClaimRewards__summary">
        <Table>
          <TableHeader
            columns={['Tokens', 'Estimated Claimable Balance', '']}
          />
          {claimsDetail.map((detail, i) => {
            return (
              <TableRow
                key={i}
                columns={[
                  detail.token,
                  `${detail.amount} UP`,
                  <div className="text-align-right">
                    <Button onClick={() => onClaimClick(detail)}>Claim</Button>
                  </div>
                ]}
              />
            )
          })}
        </Table>
      </div>

      <div className="Wrapper-Bottom-Button">
        <BottomButton label="Back" onClick={() => history.push('/liquidity')} />
      </div>
    </div>
  )
}

export { ClaimRewards }
