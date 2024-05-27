import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useAdapter } from 'Stores/Adapter/useAdapter'
import { Config } from 'Config'
import { ContractMethod } from 'Adapters/Contract'
import { useInterval } from 'Utils/useInterval'
import {
  areNumbers,
  isNaN,
  BigNumber as BN,
  truncate,
  toHex
} from 'Utils/BigNumber'
import { useLoading } from 'Stores/Loading/useLoading'
import { useContract } from 'Stores/Adapter/useContract'
import { useBalances } from 'Stores/Balances/useBalances'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { throttle } from 'Utils/Throttle'
import { getDecimals, getPrecision } from 'Utils/Decimals'
import { Icon } from '../../Components/Icon'
import { usePools } from '../Pools/usePools'

export type SwapState = {
  tokenA: string
  tokenB: string
  amountTokenA: string
  amountTokenB: string
}

export const useSwap = () => {
  const [
    { tokenA, tokenB, amountTokenA, amountTokenB },
    setSwapState
  ] = useState<SwapState>({
    tokenA: '',
    tokenB: '',
    amountTokenA: '',
    amountTokenB: ''
  })
  const [flow, setFlow] = useState<ContractMethod.BUY | ContractMethod.SELL>(
    ContractMethod.BUY
  )
  const { adapter } = useAdapter()
  const { isLoading } = useLoading()
  const { getBalanceByToken } = useBalances()
  const { addExpectedTransaction } = useTransactions()
  const { pairs } = usePools()

  // SmartContract Variables
  const [maxTransaction, setMaxTransaction] = useState('0')
  const [tradeFeeBase, setTradeFeeBase] = useState('0')
  const [price, setPrice] = useState('0')
  const [estimatedReturn, setEstimatedReturn] = useState('0')
  const [contractState, setContractState] = useState<'1' | '0'>('1')

  const selectedPair = useMemo(() => {
    const selected = Config.pairs.find((p) => {
      return tokenA === p.name && tokenB === p.againstToken
    })
    if (selected) {
      setFlow(ContractMethod.SELL)
      return selected
    }
    const invertedSelected = Config.pairs.find((p) => {
      return tokenA === p.againstToken && tokenB === p.name
    })
    if (invertedSelected) {
      setFlow(ContractMethod.BUY)
      return invertedSelected
    }
    return undefined
  }, [tokenB, tokenA])

  const tokenAContract = useMemo(() => {
    const tkn = tokenA as keyof typeof Config.contracts
    if (!Config.contracts[tkn]) return ''
    const { address } = Config.contracts[tkn]
    return address
  }, [tokenA])

  const isSwapReady = useMemo(() => {
    if (contractState === '0') return false
    const amount = [amountTokenB, amountTokenA]
    const areMountsOk = areNumbers(amount) && !!selectedPair
    const isHigherThanBalancesA = BN(
      getBalanceByToken(tokenAContract)
    ).isGreaterThanOrEqualTo(amountTokenA)
    const isLesserThanMaxTransaction = BN(amountTokenA).isLessThanOrEqualTo(
      maxTransaction
    )
    return areMountsOk && isHigherThanBalancesA && isLesserThanMaxTransaction
  }, [
    getBalanceByToken,
    contractState,
    selectedPair,
    amountTokenA,
    amountTokenB,
    maxTransaction,
    tokenAContract
  ])

  const { buy, sell, approveAllowance } = useContract(
    selectedPair?.contractAddress
  )

  const updateSwap = (state: Partial<SwapState>) => {
    setSwapState((s) => ({ ...s, ...state }))
  }

  // UPDATE METHODS
  const updateTradeFee = useCallback(async () => {
    if (selectedPair && adapter) {
      const mTx = await adapter.execute(
        selectedPair.contractAddress,
        ContractMethod.GET_FEE,
        {},
        false
      )
      const value = BN(mTx.value || '0').toFixed()
      return setTradeFeeBase(value)
    }
    setTradeFeeBase('0')
  }, [selectedPair, adapter])

  const updateContractState = useCallback(async () => {
    if (selectedPair && adapter) {
      const mTx = await adapter.execute(
        selectedPair.contractAddress,
        ContractMethod.GET_STATE,
        {},
        false
      )
      const value = mTx.value as '1' | '0'
      return setContractState(value)
    }
  }, [selectedPair, adapter])

  const tradeFee = useMemo(() => {
    const multiplier = flow === ContractMethod.BUY ? amountTokenA : amountTokenB
    return BN(tradeFeeBase)
      .multipliedBy(multiplier || 0)
      .dividedBy(Config.percentagePrecision)
      .toFixed()
  }, [tradeFeeBase, amountTokenA, amountTokenB, flow])

  const updateMaxTransaction = useCallback(async () => {
    if (selectedPair && adapter) {
      const mTx = await adapter.execute(
        selectedPair.contractAddress,
        ContractMethod.GET_MAX_TRANSACTION,
        {},
        false
      )
      const value = BN(mTx.value)
        .dividedBy(getPrecision(selectedPair.againstToken))
        .toFixed()

      if (flow === ContractMethod.SELL) {
        const maxTransactionSell = BN(value)
          .dividedBy(
            BN(price).dividedBy(getPrecision(selectedPair.againstToken))
          )
          .toFixed()
        return setMaxTransaction(maxTransactionSell)
      }

      return setMaxTransaction(value)
    }
    setMaxTransaction('0')
  }, [selectedPair, adapter, flow, price])

  const updatePrice = useCallback(async () => {
    if (selectedPair && adapter) {
      const mTx = await adapter.execute(
        selectedPair.contractAddress,
        ContractMethod.GET_PRICE,
        {},
        false
      )
      const value = BN(mTx.value).toFixed()
      return setPrice(value)
    }
    setPrice('0')
  }, [selectedPair, adapter])

  // ON EVENT METHODS

  const performSwap = useCallback(async () => {
    if (adapter && isSwapReady && !isLoading && selectedPair) {
      const method = flow === ContractMethod.BUY ? buy : sell

      if (flow === ContractMethod.SELL) {
        const allowanceNeed = BN(amountTokenA)
          .multipliedBy(getPrecision(tokenA))
          .multipliedBy(BN(tradeFee).plus(1))
          .decimalPlaces(getDecimals(tokenA))
          .toFixed()
        await approveAllowance(allowanceNeed)
      }

      const transaction = await method(amountTokenA)

      if (transaction) {
        addExpectedTransaction({
          transaction,
          movements: {
            sent: {
              name: tokenA,
              value: amountTokenA
            },
            received: {
              name: tokenB,
              value: amountTokenB
            }
          }
        })
      }

      return transaction
    }
  }, [
    addExpectedTransaction,
    amountTokenB,
    tokenA,
    tokenB,
    isSwapReady,
    adapter,
    selectedPair,
    amountTokenA,
    approveAllowance,
    buy,
    flow,
    isLoading,
    sell,
    tradeFee
  ])

  const onInputChange = (inputName: 'TokenA' | 'TokenB') => (value: string) => {
    if (!selectedPair) return

    if (isNaN(value) && value !== '') return
    const val = value || '0'

    if (inputName === 'TokenA') {
      updateSwap({
        amountTokenA: val
      })
    }
  }

  // COMPUTED VARIABLES

  const getEstimatedReturn = useCallback(
    throttle(async () => {
      if (!adapter || !selectedPair || !amountTokenA) return
      const method =
        flow === ContractMethod.BUY
          ? ContractMethod.GET_ESTIMATED_BUY_RECEIVE_AMOUNT
          : ContractMethod.GET_ESTIMATED_SELL_RECEIVE_AMOUNT

      const precision =
        flow === ContractMethod.BUY
          ? getPrecision(selectedPair.againstToken)
          : getPrecision(selectedPair.name)

      const amount = toHex(
        truncate(BN(amountTokenA).multipliedBy(precision).toFixed())
      )

      const mTx = await adapter.execute(
        selectedPair.contractAddress,
        method,
        {
          args: [amount]
        },
        false
      )
      const value = BN(mTx.value).dividedBy(getPrecision(tokenB)).toFixed()

      updateSwap({ amountTokenB: value })
      setEstimatedReturn(value)
    }),
    [amountTokenA, flow, adapter, selectedPair]
  )

  const tokenAFactorized = useMemo(() => {
    if (!tokenA || !amountTokenA) return '0'
    return BN(amountTokenA).multipliedBy(getPrecision(tokenA))
  }, [amountTokenA, tokenA])

  const estimatedPrice = useMemo(() => {
    if (!selectedPair) return '0'
    if (!estimatedReturn || !amountTokenA || BN(amountTokenA).isZero()) {
      if (flow === ContractMethod.BUY) {
        return BN(1)
          .dividedBy(
            BN(price).dividedBy(getPrecision(selectedPair.againstToken))
          )
          .decimalPlaces(getDecimals(tokenB))
          .toFixed()
      } else {
        return BN(price)
          .dividedBy(getPrecision(selectedPair.againstToken))
          .decimalPlaces(getDecimals(tokenB))
          .toFixed()
      }
    }
    return BN(estimatedReturn).dividedBy(amountTokenA).toFixed()
  }, [estimatedReturn, price, amountTokenA, flow, selectedPair, tokenB])

  const slippage = useMemo(() => {
    const factorizedEstimatedReturn = BN(estimatedReturn).multipliedBy(
      getPrecision(tokenB)
    )
    if (!tokenAFactorized) return '0'
    let result
    if (flow === ContractMethod.BUY) {
      const estimatedReturnPrice = BN(tokenAFactorized)
        .dividedBy(factorizedEstimatedReturn)
        .multipliedBy(getPrecision(tokenB))
      result = BN(estimatedReturnPrice)
        .minus(BN(price))
        .dividedBy(price)
        .multipliedBy(100)
    } else {
      const estimatedReturnPrice = BN(factorizedEstimatedReturn)
        .dividedBy(tokenAFactorized)
        .multipliedBy(getPrecision(tokenA))
      result = BN(price)
        .minus(BN(estimatedReturnPrice))
        .dividedBy(estimatedReturnPrice)
        .multipliedBy(100)
    }
    return result.isNaN()
      ? '0'
      : result
          .minus(BN(tradeFeeBase).dividedBy(1000))
          .decimalPlaces(2)
          .abs()
          .toFixed()
  }, [
    tokenAFactorized,
    price,
    flow,
    estimatedReturn,
    tokenB,
    tokenA,
    tradeFeeBase
  ])

  // CLOCKS

  useEffect(() => {
    getEstimatedReturn()
  }, [amountTokenA, getEstimatedReturn])

  useEffect(() => {
    updateContractState()
    updatePrice()
    updateMaxTransaction()
    updateTradeFee()
    // eslint-disable-next-line
  }, [selectedPair, updatePrice, updateMaxTransaction, updateTradeFee])

  useInterval(() => {
    updateContractState()
    updateMaxTransaction()
    updateTradeFee()
    updatePrice()
    getEstimatedReturn()
  }, 4000)

  const selectablePairs = useMemo(() => {
    const basePairs = Array.from(new Set(pairs.map((x) => x.token_a))).map(
      (p) => ({
        label: (
          <>
            <Icon icon={p} /> {p}
          </>
        ),
        value: p
      })
    )
    const againstPairs = Array.from(new Set(pairs.map((x) => x.token_b))).map(
      (p) => ({
        label: (
          <>
            <Icon icon={p} /> {p}
          </>
        ),
        value: p
      })
    )
    return [...againstPairs, ...basePairs]
  }, [pairs])

  const toAvailablePairs = useMemo(() => {
    if (!tokenA) return selectablePairs
    const candidatesBuy = pairs
      .filter((p) => p.token_a === tokenA)
      .map((p) => selectablePairs.find((x) => x.value === p.token_b)!)
    const candidatesSell = pairs
      .filter((p) => p.token_b === tokenA)
      .map((p) => selectablePairs.find((x) => x.value === p.token_a)!)
    return [...candidatesBuy, ...candidatesSell]
  }, [tokenA, selectablePairs, pairs])

  return {
    updateSwap,
    performSwap,
    onInputChange,
    maxTransaction,
    selectedPair,
    tokenA,
    tokenB,
    amountTokenA,
    amountTokenB,
    tradeFee,
    isSwapReady,
    flow,
    slippage,
    price: estimatedPrice,
    toAvailablePairs
  }
}
