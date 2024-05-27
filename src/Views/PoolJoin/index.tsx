import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import BottomButton from 'Components/BottomButton'
import { Table, TableRow, TableHeader } from 'Components/Table'
import { Add } from '@material-ui/icons'
import Input from 'Components/Input'
import Button from 'Components/Button'
import { useAdapter } from 'Stores/Adapter/useAdapter'
import { ContractMethod } from 'Adapters/Contract'
import { Config } from 'Config'
import { useBalances } from 'Stores/Balances/useBalances'
import {
  BigNumber as BN,
  localiseNumber,
  isNumberAndNonZero,
  truncateDecimals,
  isNaN,
  toBNFixed
} from 'Utils/BigNumber'
import { useContract } from 'Stores/Adapter/useContract'
import { useInterval } from 'Utils/useInterval'
import { useLoading } from 'Stores/Loading/useLoading'
import { Back } from 'Components/Back'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { useToasts } from 'react-toast-notifications'
import { getDecimals, getPrecision } from 'Utils/Decimals'
import { useTranslation } from 'react-i18next'

import './PoolJoin.scss'

const PoolJoin: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { contractAddress } = useParams()
  const { addToast } = useToasts()
  const { approveAllowance, deposit } = useContract(contractAddress)
  const { execute, adapter } = useAdapter()
  const { getBalanceByToken } = useBalances()
  const { isLoading } = useLoading()
  const { addExpectedTransaction } = useTransactions()
  const [tokenAInput, setTokenAInput] = useState('')
  const [tokenBInput, setTokenBInput] = useState('')
  const [pairDetail, setPairDetail] = useState({
    name: '',
    token: '',
    againstToken: '',
    price: '0',
    againstPrice: '0',
    totalSupply: 0,
    shareOfPool: 0,
    uTokenBalance: '0',
    contractAgainstTokenBalance: '0',
    contractTokenBalance: '0'
  })

  const pairConfig = useMemo(() => {
    return Config.pairs.find((p) => p.contractAddress === contractAddress)
  }, [contractAddress])

  const updatePair = useCallback(async () => {
    if (adapter && contractAddress && pairConfig) {
      const [
        ulPrice,
        tSupply,
        uPairTokenBalance,
        uPairAgainstTokenBalance
      ] = await Promise.all([
        execute(contractAddress, ContractMethod.GET_PRICE),
        execute(contractAddress, ContractMethod.TOTAL_SUPPLY),
        adapter
          .getBalanceOf(pairConfig.tokenAddress, contractAddress)
          .then((x) => x.balance),
        adapter
          .getBalanceOf(pairConfig.againstTokenAddress, contractAddress)
          .then((x) => x.balance)
      ])

      const uTokenBalance = getBalanceByToken(contractAddress)

      const totalSupply = BN(tSupply.value)
        .dividedBy(getPrecision(contractAddress))
        .decimalPlaces(getDecimals(contractAddress))
        .toNumber()

      const contractTokenBalance = BN(uTokenBalance)
        .dividedBy(totalSupply)
        .multipliedBy(uPairTokenBalance)
        .toFixed()

      const contractAgainstTokenBalance = BN(uTokenBalance)
        .dividedBy(totalSupply)
        .multipliedBy(uPairAgainstTokenBalance)
        .toFixed()

      const price = BN(ulPrice.value)
        .dividedBy(getPrecision(pairConfig.againstToken))
        .decimalPlaces(getDecimals(pairConfig.name))
        .toFixed()

      const shareOfPool =
        BN(uTokenBalance).dividedBy(totalSupply).multipliedBy(100).toNumber() ||
        0

      const againstPrice = BN(1)
        .dividedBy(price)
        .decimalPlaces(getDecimals(pairConfig.againstToken))
        .toFixed()

      setPairDetail((detail) => ({
        ...detail,
        price,
        againstPrice,
        totalSupply,
        uTokenBalance,
        contractTokenBalance,
        contractAgainstTokenBalance,
        shareOfPool,
        ...pairConfig
      }))
    }
    // eslint-disable-next-line
  }, [execute, contractAddress, adapter, pairConfig])

  const tokenA = useMemo(() => {
    if (pairConfig) {
      return getBalanceByToken(pairConfig!.tokenAddress)
    }
    return '0'
  }, [getBalanceByToken, pairConfig])
  const tokenB = useMemo(() => {
    if (pairConfig) {
      return getBalanceByToken(pairConfig?.againstTokenAddress)
    }
    return '0'
  }, [getBalanceByToken, pairConfig])

  const onClickApprove = async () => {
    if (
      adapter &&
      !isLoading &&
      isNumberAndNonZero(tokenAInput) &&
      pairConfig
    ) {
      if (
        BN(tokenAInput).isGreaterThan(tokenA) ||
        BN(tokenBInput).isGreaterThan(tokenB)
      ) {
        return addToast(<div>Typed amount is greater than your balances</div>, {
          appearance: 'warning'
        })
      }

      const allowanceNeed = BN(tokenAInput)
        .multipliedBy(getPrecision(pairConfig!.tokenAddress))
        .decimalPlaces(getDecimals(pairConfig!.tokenAddress))
        .toFixed()

      await approveAllowance(allowanceNeed)

      const depositAmount = BN(tokenBInput)
        .multipliedBy(getPrecision(pairConfig!.againstTokenAddress))
        .decimalPlaces(getDecimals(pairConfig!.againstTokenAddress))
        .toNumber()

      const depositResult = await deposit(depositAmount)

      if (depositResult && depositResult.success) {
        addExpectedTransaction({
          transaction: depositResult,
          movements: {
            deposited: [
              {
                name: pairConfig.name,
                value: tokenAInput
              },
              {
                name: pairConfig.againstToken,
                value: tokenBInput
              }
            ]
          }
        })

        history.push(
          `/liquidity/pool/join/${contractAddress}/success/${depositResult.hash}`
        )
      } else {
        history.push('/failed')
      }
    }
  }

  const onInputChange = (inputName: 'TokenA' | 'TokenB') => (value: string) => {
    if (isNaN(value) && value !== '') return
    const val = truncateDecimals(value || '0')
    if (inputName === 'TokenA') {
      const againstPrice = BN(val)
        .multipliedBy(pairDetail.price)
        .decimalPlaces(getDecimals(contractAddress))
        .toFixed()
      setTokenBInput(isNaN(againstPrice) ? '' : againstPrice)
      setTokenAInput(truncateDecimals(val))
    } else {
      const againstPrice = BN(val)
        .multipliedBy(pairDetail.againstPrice)
        .decimalPlaces(getDecimals(contractAddress))
        .toFixed()
      setTokenAInput(isNaN(againstPrice) ? '' : againstPrice)
      setTokenBInput(val)
    }
  }

  useEffect(() => {
    updatePair()
  }, [adapter, updatePair])

  useInterval(() => {
    updatePair()
  }, 10000)

  return (
    <div className="PoolJoin">
      <div className="PoolJoin__band PoolJoin__band-summary">
        <Table>
          <TableHeader
            columns={[
              t('liquidity.pool-join.AperB', {
                tokenA: pairDetail.name,
                tokenB: pairDetail.againstToken
              }),
              t('liquidity.pool-join.shareOfPool'),
              t('liquidity.pool-join.BperA', {
                tokenA: pairDetail.name,
                tokenB: pairDetail.againstToken
              })
            ]}
          />
          <TableRow
            columns={[
              <span>{toBNFixed(pairDetail.againstPrice)}</span>,
              <span className="color-dark-green">
                {localiseNumber(pairDetail.shareOfPool)} %
              </span>,
              <span>{toBNFixed(pairDetail.price)}</span>
            ]}
          />
        </Table>
      </div>
      <div className="PoolJoin__swap-options">
        <div className="PoolJoin__swap-options__pair">
          <div className="PoolJoin__swap-options__pair__header">
            <h1>{t('liquidity.pool-join.input')}</h1>
            <Button green icon={pairDetail.name}>
              {pairDetail.name}
            </Button>
          </div>
          <Input
            placeholder={t('liquidity.pool-join.input-amount-deposit')}
            onlyNumbers
            balance={tokenA}
            value={tokenAInput}
            onChange={onInputChange('TokenA')}
            max
          />
        </div>
        <div className="PoolJoin__swap-options__add">
          <Add />
        </div>
        <div className="PoolJoin__swap-options__pair">
          <div className="PoolJoin__swap-options__pair__header">
            <h1>{t('liquidity.pool-join.input')}</h1>
            <Button green icon={pairDetail.againstToken}>
              {pairDetail.againstToken}
            </Button>
          </div>
          <Input
            placeholder={t('liquidity.pool-join.input-amount-deposit')}
            onlyNumbers
            balance={tokenB}
            value={tokenBInput}
            onChange={onInputChange('TokenB')}
            max
          />
        </div>
      </div>
      <div className="PoolJoin__band PoolJoin__band-liquidity">
        <div>{t('liquidity.pool-join.user-liquidity')}</div>
        <Table>
          <TableRow
            columns={[
              <span>{pairDetail.name}</span>,
              <div className="text-align-right">
                {localiseNumber(pairDetail.contractTokenBalance)}
              </div>
            ]}
          />
          <TableRow
            columns={[
              <span>{pairDetail.token}</span>,
              <div className="text-align-right">{pairDetail.uTokenBalance}</div>
            ]}
          />
          <TableRow
            columns={[
              <span>{pairDetail.againstToken}</span>,
              <div className="text-align-right">
                {localiseNumber(pairDetail.contractAgainstTokenBalance)}
              </div>
            ]}
          />
        </Table>
      </div>

      <div className="Wrapper-Bottom-Button">
        <Back />
        <BottomButton
          label={t('liquidity.pool-join.submit')}
          onClick={onClickApprove}
        />
      </div>
    </div>
  )
}

export { PoolJoin }
