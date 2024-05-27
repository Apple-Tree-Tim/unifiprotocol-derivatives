import React, { useReducer, createContext } from 'react'
import {
  PoolsState,
  PoolsReducer,
  PoolsActions,
  PoolsContextState
} from './Types'

export const defaultState: PoolsState = {
  pools: [],
  pairs: [],
  contracts: {}
}

const init = () => defaultState

export const reducer: PoolsReducer = (state = init(), action) => {
  let result = state
  switch (action.type) {
    case PoolsActions.ADD_POOL:
      result = {
        ...state,
        pools: [...state.pools, ...(action.payload?.pools || [])]
      }
      break
    case PoolsActions.ADD_PAIR:
      result = {
        ...state,
        pairs: [...state.pairs, ...(action.payload?.pairs || [])]
      }
      break
    case PoolsActions.ADD_CONTRACT:
      result = {
        ...state,
        contracts: { ...state.contracts, ...(action.payload?.contracts || {}) }
      }
      break
    case PoolsActions.CLEAR:
      result = {
        ...state,
        pools: []
      }
      break
    default:
      result = state
      break
  }
  return result
}

export const PoolsContext = createContext<PoolsContextState>({
  state: init(),
  dispatch: () => {}
})

export const PoolsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<PoolsReducer, PoolsState>(
    reducer,
    defaultState,
    init
  )

  return (
    <PoolsContext.Provider value={{ state, dispatch }}>
      {children}
    </PoolsContext.Provider>
  )
}
