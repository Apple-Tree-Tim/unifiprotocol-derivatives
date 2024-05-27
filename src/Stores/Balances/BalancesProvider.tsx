import React, { useReducer, createContext } from 'react'
import { AdapterBalance } from '../../Adapters/IAdapter'
import {
  BalancesState,
  BalancesReducer,
  BalancesActions,
  BalancesContextState
} from './Types'

export const defaultState: BalancesState = {
  balances: []
}

const init = () => defaultState

export const reducer: BalancesReducer = (state = init(), action) => {
  let result = state
  switch (action.type) {
    case BalancesActions.REFRESH:
      result = {
        ...state,
        ...action.payload
      }
      break
    case BalancesActions.UPDATE_BALANCE:
      const payload = action.payload as AdapterBalance
      const currentBalance = state.balances.find(b => b.name === payload.name)

      if (currentBalance) {
        currentBalance.balance = payload.balance
      } else {
        state.balances.push(payload)
      }

      result = {
        ...state
      }
      break
    default:
      result = state
      break
  }
  return result
}

export const BalancesContext = createContext<BalancesContextState>({
  state: init(),
  dispatch: () => { }
})

export const BalancesProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<BalancesReducer, BalancesState>(
    reducer,
    defaultState,
    init
  )

  return (
    <BalancesContext.Provider value={{ state, dispatch }}>
      {children}
    </BalancesContext.Provider>
  )
}
