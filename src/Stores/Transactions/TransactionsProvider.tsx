import React, { useReducer, createContext } from 'react'
import {
  TransactionsState,
  TransactionsReducer,
  TransactionsActions,
  TransactionsContextState
} from './Types'

export const defaultState: TransactionsState = {
  transactions: [],
  expectedTransactions: []
}

const init = () => defaultState

export const reducer: TransactionsReducer = (state = init(), action) => {
  let result = state
  switch (action.type) {
    case TransactionsActions.ADD_TRANSACTION:
      result = {
        ...state,
        transactions: [
          ...state.transactions,
          ...(action.payload?.transactions || [])
        ]
      }
      break
    case TransactionsActions.ADD_EXPECTED_TRANSACTION:
      result = {
        ...state,
        expectedTransactions: [
          ...state.expectedTransactions,
          ...(action.payload?.expectedTransactions || [])
        ]
      }
      break
    default:
      result = state
      break
  }
  return result
}

export const TransactionsContext = createContext<TransactionsContextState>({
  state: init(),
  dispatch: () => {}
})

export const TransactionsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<TransactionsReducer, TransactionsState>(
    reducer,
    defaultState,
    init
  )

  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionsContext.Provider>
  )
}
