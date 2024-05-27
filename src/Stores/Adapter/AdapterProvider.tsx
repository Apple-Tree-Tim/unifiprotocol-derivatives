import React, { useReducer, createContext } from 'react'
import {
  AdapterState,
  AdapterReducer,
  AdapterActions,
  AdapterContextState
} from './Types'

export const defaultState: AdapterState = {
  adapter: undefined,
  isConnectionReady: false
}

const init = () => defaultState

const reducer: AdapterReducer = (state = init(), action) => {
  let result = state
  switch (action.type) {
    case AdapterActions.SET_ADAPTER:
      result = {
        ...state,
        ...action.payload
      }
      break
    default:
      result = state
      break
  }
  return result
}

export const AdapterContext = createContext<AdapterContextState>({
  state: init(),
  dispatch: () => {}
})

export const AdapterProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<AdapterReducer, AdapterState>(
    reducer,
    defaultState,
    init
  )

  return (
    <AdapterContext.Provider value={{ state, dispatch }}>
      {children}
    </AdapterContext.Provider>
  )
}
