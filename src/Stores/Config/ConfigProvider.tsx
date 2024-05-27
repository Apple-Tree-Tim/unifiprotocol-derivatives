import React, { useReducer, createContext } from 'react'
import { useLocalStorage } from '../../Utils/useLocalStorage'
import {
  ConfigActions,
  ConfigReducer,
  ConfigState,
  ConfigContextState
} from './Types'

export const defaultState: ConfigState = {
  warning: { lastConfirmation: 0 }
}

const init = (customInitialState: Partial<ConfigState> = {}) => {
  return {
    ...defaultState,
    ...customInitialState
  }
}

export const reducer: ConfigReducer = (state = init(), action) => {
  let result = state
  switch (action.type) {
    case ConfigActions.SET_WARNING:
      localStorage.setItem('unifi_agreement', JSON.stringify(Date.now()))
      result = {
        ...state,
        warning: {
          lastConfirmation: Date.now()
        }
      }
      break
    default:
      result = state
      break
  }
  return result
}

export const ConfigContext = createContext<ConfigContextState>({
  state: init(),
  dispatch: () => {}
})

export const ConfigProvider: React.FC = ({ children }) => {
  const [lastConfirmation] = useLocalStorage<any>('unifi_agreement', '0')
  const [state, dispatch] = useReducer<ConfigReducer, ConfigState>(
    reducer,
    defaultState,
    () => init({ warning: { lastConfirmation } })
  )

  return (
    <ConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfigContext.Provider>
  )
}
