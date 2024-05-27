import React, { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Input from 'Components/Input'
import BottomButton from 'Components/BottomButton'
import SwapDetail from 'Components/SwapDetail'
import { useSwap } from 'Stores/Swap/useSwap'
import { Config, Pairs } from 'Config'
import { useBalances } from 'Stores/Balances/useBalances'
import { truncateDecimals } from 'Utils/BigNumber'
import { SwapHoriz } from '@material-ui/icons'
import { TokenSelector } from 'Components/TokenSelector'
import { getDecimals } from 'Utils/Decimals'
import { useTranslation } from 'react-i18next'

import './Swap.scss'

type TokenOption = undefined | typeof Pairs[number]

export const Swap: React.FC = () => {
  const { t } = useTranslation()
  const { getBalanceByToken } = useBalances()
  const history = useHistory()
  const {
    updateSwap,
    performSwap,
    onInputChange,
    maxTransaction,
    tokenA,
    tokenB,
    amountTokenB,
    amountTokenA,
    selectedPair,
    tradeFee,
    price,
    slippage,
    isSwapReady,
    toAvailablePairs
  } = useSwap()
  const [tokenASelected, setTokenASelected] = useState<TokenOption>()
  const [tokenBSelected, setTokenBSelected] = useState<TokenOption>()

  const onSubmitHandler = useCallback(async () => {
    const swapResponse = await performSwap()
    if (swapResponse && swapResponse.success) {
      history.push(`/trade/success/${swapResponse.hash}`)
    } else {
      history.push('/failed')
    }
  }, [performSwap, history])

  const tokenABalances = useMemo(() => {
    const detail = Config.contracts[tokenA as keyof typeof Config.contracts]
    if (detail) {
      return getBalanceByToken(detail.address)
    }
    return '0'
  }, [tokenA, getBalanceByToken])

  const tokenBBalances = useMemo(() => {
    const detail = Config.contracts[tokenB as keyof typeof Config.contracts]
    if (detail) {
      return getBalanceByToken(detail.address)
    }
    return '0'
  }, [tokenB, getBalanceByToken])

  const truncatedTokenA = useMemo(() => {
    // special use case for ONT where decimals dont apply
    if (tokenA === 'ONT') {
      return amountTokenA ? truncateDecimals(amountTokenA, 0) : ''
    }
    return amountTokenA
      ? truncateDecimals(amountTokenA, getDecimals(tokenA))
      : ''
  }, [amountTokenA, tokenA])

  const truncatedTokenB = useMemo(() => {
    return amountTokenB
      ? truncateDecimals(amountTokenB, getDecimals(tokenB))
      : ''
  }, [amountTokenB, tokenB])

  const onClickSwap = () => {
    setTokenASelected(tokenBSelected)
    setTokenBSelected(tokenASelected)
    updateSwap({
      tokenA: tokenB,
      tokenB: tokenA,
      amountTokenA: amountTokenB,
      amountTokenB: amountTokenA
    })
  }

  return (
    <div className="Swap">
      <span className="Swap__actions">
        <span className="Swap__actions__action">
          <div className="Swap__actions__action__orientation">
            <h1>{t('trade.from')}</h1>
            <TokenSelector
              selected={tokenASelected}
              options={Pairs}
              onChange={(v) => {
                setTokenASelected(v)
                updateSwap({ tokenA: v.value })
              }}
            />
          </div>
          <div>
            <Input
              onlyNumbers
              placeholder={t('trade.enter-amount')}
              onChange={onInputChange('TokenA')}
              value={truncatedTokenA}
              balance={tokenABalances}
              max
            />
          </div>
        </span>
        <span className="Swap__actions__separator" onClick={onClickSwap}>
          <SwapHoriz />
        </span>
        <span className="Swap__actions__action">
          <div className="Swap__actions__action__orientation">
            <h1>{t('trade.to')}</h1>
            <TokenSelector
              selected={tokenBSelected}
              options={toAvailablePairs}
              onChange={(v) => {
                setTokenBSelected(v)
                updateSwap({ tokenB: v.value })
              }}
            />
          </div>
          <div>
            <Input
              onlyNumbers
              onChange={onInputChange('TokenB')}
              value={truncatedTokenB}
              balance={tokenBBalances}
              disabled
            />
          </div>
        </span>
      </span>
      <SwapDetail
        tokenA={tokenA}
        tokenB={tokenB}
        maxTransaction={maxTransaction}
        selectedPair={selectedPair}
        tradeFee={tradeFee}
        price={price}
        slippage={slippage}
      />

      {isSwapReady && (
        <div className="Wrapper-Bottom-Button">
          <BottomButton label={t('trade.submit')} onClick={onSubmitHandler} />
        </div>
      )}
    </div>
  )
}
