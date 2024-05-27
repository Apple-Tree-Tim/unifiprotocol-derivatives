import { Dispatch } from 'react'
import { IAdapter } from '../../Adapters/IAdapter'

export type AdapterState = {
  adapter: IAdapter | undefined
  isConnectionReady: boolean
}

export enum AdapterActions {
  SET_ADAPTER = 'SET_ADAPTER'
}

export type AdapterAction = {
  type: AdapterActions
  payload?: Partial<AdapterState>
}

export type AdapterReducer = (
  state: AdapterState,
  action: AdapterAction
) => AdapterState

export type AdapterContextState = {
  state: AdapterState
  dispatch: Dispatch<AdapterAction>
}
