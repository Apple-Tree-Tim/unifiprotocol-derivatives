import { Dispatch } from 'react'

export type ConfigState = {
  warning: { lastConfirmation: number }
}

export enum ConfigActions {
  SET_WARNING = 'SET_WARNING'
}

export type ConfigAction = {
  type: ConfigActions
  payload?: Partial<ConfigState>
}

export type ConfigReducer = (
  state: ConfigState,
  action: ConfigAction
) => ConfigState

export type ConfigContextState = {
  state: ConfigState
  dispatch: Dispatch<ConfigAction>
}
