import React, { useReducer, createContext } from 'react'
import {
  LoadingState,
  LoadingReducer,
  LoadingActions,
  LoadingContextState
} from './Types'

export const defaultState: LoadingState = {
  totalRequests: 0,
  loading: 0
}

const init = () => defaultState

export const reducer: LoadingReducer = (state = init(), action) => {
  let result = state
  switch (action.type) {
    case LoadingActions.START_LOADING:
      result = {
        ...state,
        totalRequests: state.totalRequests + 1
      }
      break
    case LoadingActions.FINISH_LOADING:
      result = {
        ...state,
        loading: state.loading + 1
      }
      break
    default:
      result = state
      break
  }
  return result
}

export const LoadingContext = createContext<LoadingContextState>({
  state: init(),
  dispatch: () => {}
})

export const LoadingProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<LoadingReducer, LoadingState>(
    reducer,
    defaultState,
    init
  )

  return (
    <LoadingContext.Provider value={{ state, dispatch }}>
      {children}
    </LoadingContext.Provider>
  )
}
