import { useContext } from 'react'
import { BalancesContext } from './BalancesProvider'
import { useAdapter } from '../Adapter/useAdapter'
import { BalancesActions, Token } from './Types'
import { Emitter, EmitterAction } from 'Utils/EventEmitter'
import { AdapterBalance } from '../../Adapters/IAdapter'

export const useBalances = () => {
  const {
    state: { balances },
    dispatch
  } = useContext(BalancesContext)
  const { adapter, isConnectionReady } = useAdapter()

  const updateBalances = async () => {
    if (adapter && isConnectionReady) {
      await adapter.getBalances()
      setTimeout(() => {
        Emitter.emit(EmitterAction.REFRESH_BALANCES)
      }, 2000)
    }
  }

  const updateBalance = async (balances: AdapterBalance[]) => {
    balances.forEach((b) => {
      dispatch({
        type: BalancesActions.UPDATE_BALANCE,
        payload: b
      })
    })
  }

  const getBalanceByToken = (token: string | Token) => {
    const tokenBalance = balances.find((t) => t.name === token)
    return tokenBalance?.balance || '0'
  }

  return {
    updateBalance,
    updateBalances,
    getBalanceByToken,
    balances
  }
}
