import React, { useEffect } from 'react'
import { useAdapter } from 'Stores/Adapter/useAdapter'
import { useBalances } from 'Stores/Balances/useBalances'
import { useInterval } from 'Utils/useInterval'
import { usePools } from 'Stores/Pools/usePools'
import { Emitter, EmitterAction } from 'Utils/EventEmitter'
import { useLocation } from 'react-router-dom'

const Updater: React.FC = ({ children }) => {
  const { connect, adapter } = useAdapter()
  const { updateBalances, updateBalance } = useBalances()
  const { updatePools, updatePairs } = usePools()
  const location = useLocation()

  useEffect(() => {
    connect()
    updatePools()
    updatePairs()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!adapter) return
    updateBalances()
    Emitter.on(EmitterAction.REFRESH_BALANCES, updateBalances)
    Emitter.on(EmitterAction.BALANCE, updateBalance as any)
    // eslint-disable-next-line
  }, [adapter])

  // useInterval(
  //   () => {
  //     if (document.hidden) return
  //     updateBalances()
  //   },
  //   adapter ? 7000 : null
  // )

  useInterval(() => {
    if (document.hidden) return
    if (!location.pathname.match(/liquidity\/pool$/)) updatePools()
  }, 30000)

  return <>{children}</>
}

export default Updater
