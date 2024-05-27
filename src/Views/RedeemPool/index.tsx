import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Input from 'Components/Input'
import { Table, TableRow } from 'Components/Table'
import { useHistory, useParams } from 'react-router-dom'
import BottomButton from 'Components/BottomButton'
import UnbrandedUnifi from 'Assets/unifi-logo-unbranded.png'
import { Config } from 'Config'
import { ContractMethod } from 'Adapters/Contract'
import BigNumber from 'bignumber.js'
import { useAdapter } from 'Stores/Adapter/useAdapter'
import { useInterval } from 'Utils/useInterval'
import { useBalances } from 'Stores/Balances/useBalances'
import {
  localiseNumber,
  isNumberAndNonZero,
  truncateDecimals,
  isNaN,
  BigNumber as BN
} from 'Utils/BigNumber'
import { useLoading } from 'Stores/Loading/useLoading'
import { useContract } from 'Stores/Adapter/useContract'
import { Back } from 'Components/Back'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { useToasts } from 'react-toast-notifications'
import { getDecimals, getPrecision } from 'Utils/Decimals'
import { Trans, useTranslation } from 'react-i18next'

import './RedeemPool.scss'

const RedeemPool: React.FC = () => {
  const { addToast } = useToasts()
  const history = useHistory()
  const { contractAddress } = useParams()
  const { getBalanceByToken } = useBalances()
  const { withdraw } = useContract(contractAddress)
  const { isConnectionReady, adapter } = useAdapter()
  const [redeemAmount, setRedeemAmount] = useState('')
  const [uTotalSupply, setUTotalSupply] = useState('0')
  const [price, setPrice] = useState('0')
  const [uContractBalance, setUContractBalance] = useState({
    tokenA: '0',
    tokenB: '0'
  })
  const { isLoading } = useLoading()
  const { addExpectedTransaction } = useTransactions()
  const { t } = useTranslation()

  const pairConfig = useMemo(() => {
    return Config.pairs.find((p) => p.contractAddress === contractAddress)
  }, [contractAddress])

  const onInputChange = async (val: string) => {
    if (isNaN(val) && val !== '') return
    const value = val || '0'

    setRedeemAmount(truncateDecimals(value))
  }

  const uBalance = useMemo(() => {
    return getBalanceByToken(contractAddress)
  }, [getBalanceByToken, contractAddress])

  const updatePrice = useCallback(async () => {
    if (pairConfig && adapter) {
      const mTx = await adapter.execute(
        pairConfig.contractAddress,
        ContractMethod.GET_PRICE,
        {},
        false
      )
      const value = BN(mTx.value).toFixed()
      return setPrice(value)
    }
    setPrice('0')
  }, [pairConfig, adapter])

  const updateTotalSupply = useCallback(async () => {
    if (adapter && contractAddress) {
      const uTotalSupply = await adapter.execute(
        contractAddress,
        ContractMethod.TOTAL_SUPPLY,
        {},
        false
      )
      const tSupply = new BigNumber(uTotalSupply.value)
        .dividedBy(getPrecision(contractAddress))
        .toFixed()
      setUTotalSupply(tSupply)
    }
  }, [contractAddress, adapter])

  const uTokenABalance = useCallback(async () => {
    if (adapter && pairConfig && contractAddress) {
      const uBalance = await adapter.getBalanceOf(
        pairConfig.tokenAddress,
        contractAddress
      )
      const uBalanceReduced = new BigNumber(uBalance.balance).toFixed()
      setUContractBalance((s) => ({ ...s, tokenA: uBalanceReduced }))
    }
  }, [adapter, pairConfig, contractAddress])

  const uTokenBBalance = useCallback(async () => {
    if (adapter && pairConfig && contractAddress) {
      const uBalance = await adapter.getBalanceOf(
        pairConfig.againstTokenAddress,
        contractAddress
      )
      const uBalanceReduced = new BigNumber(uBalance.balance).toFixed()
      setUContractBalance((s) => ({ ...s, tokenB: uBalanceReduced }))
    }
  }, [adapter, pairConfig, contractAddress])

  const againstTokenRedeemQty = useMemo(() => {
    return BN(redeemAmount)
      .multipliedBy(uContractBalance.tokenB)
      .dividedBy(uTotalSupply)
      .toNumber()
  }, [redeemAmount, uContractBalance, uTotalSupply])

  const tokenRedeemQty = useMemo(() => {
    if (!pairConfig) return 0
    return BN(againstTokenRedeemQty)
      .dividedBy(price)
      .multipliedBy(getPrecision(pairConfig.againstTokenAddress))
      .toNumber()
  }, [price, againstTokenRedeemQty, pairConfig])

  const onClickApprove = async () => {
    if (
      isConnectionReady &&
      !isLoading &&
      isNumberAndNonZero(redeemAmount) &&
      pairConfig
    ) {
      if (new BigNumber(redeemAmount).isGreaterThan(uBalance)) {
        return addToast(<div>Typed amount is greater than your balances</div>, {
          appearance: 'warning'
        })
      }

      const amount = new BigNumber(redeemAmount)
        .multipliedBy(getPrecision(contractAddress))
        .decimalPlaces(getDecimals(contractAddress))
        .toFixed()

      const depositResult = await withdraw(amount)

      if (depositResult && depositResult.success) {
        addExpectedTransaction({
          transaction: depositResult,
          movements: {
            withdrawn: [
              {
                name: pairConfig.name,
                value: tokenRedeemQty
              },
              {
                name: pairConfig.againstToken,
                value: againstTokenRedeemQty
              }
            ]
          }
        })

        history.push(
          `/liquidity/remove-pool/${contractAddress}/success/${depositResult.hash}`
        )
      } else {
        history.push('/failed')
      }
    }
  }

  useEffect(() => {
    updateTotalSupply()
    uTokenABalance()
    uTokenBBalance()
    updatePrice()
  }, [
    isConnectionReady,
    updateTotalSupply,
    uTokenBBalance,
    uTokenABalance,
    updatePrice
  ])

  useInterval(() => {
    updateTotalSupply()
    uTokenABalance()
    uTokenBBalance()
    updatePrice()
  }, 6000)

  return pairConfig ? (
    <>
      <div className="RedeemPool">
        <div className="RedeemPool__header">
          <img src={UnbrandedUnifi} alt="Unifi" />
          <span>
            <h1>
              {t('liquidity.redeem-pool.title', { token: pairConfig.token })}
            </h1>
            <p>{t('liquidity.redeem-pool.p-1')}</p>
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

        <div className="RedeemPool__redeem">
          <Input
            placeholder={t('liquidity.redeem-pool.enter-amount')}
            balance={uBalance}
            value={redeemAmount}
            onlyNumbers
            onChange={onInputChange}
            max
            exactMax
          />
        </div>

        <div className="RedeemPool__summary">
          <div className="RedeemPool__summary__title">
            {t('liquidity.redeem-pool.user-receive')}
          </div>
          <Table>
            <TableRow
              columns={[
                pairConfig.againstToken,
                localiseNumber(againstTokenRedeemQty || 0)
              ]}
            />
            <TableRow
              columns={[pairConfig.name, localiseNumber(tokenRedeemQty || 0)]}
            />
          </Table>
        </div>
      </div>
      <div className="Wrapper-Bottom-Button">
        <Back />
        <BottomButton
          label={t('liquidity.redeem-pool.submit')}
          onClick={onClickApprove}
        />
      </div>
    </>
  ) : null
}

export { RedeemPool }
