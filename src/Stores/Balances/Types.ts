import { Dispatch } from 'react'
import { AdapterBalance } from 'Adapters/IAdapter'

export enum Token {
  UP = 'UP'
}

export type BalancesState = {
  balances: AdapterBalance[]
}

export enum BalancesActions {
  REFRESH = 'REFRESH',
  UPDATE_BALANCE = 'UPDATE_BALANCE'
}

export type BalancesAction = {
  type: BalancesActions
  payload?: Partial<BalancesState> | AdapterBalance
}

export type BalancesReducer = (
  state: BalancesState,
  action: BalancesAction
) => BalancesState

export type BalancesContextState = {
  state: BalancesState
  dispatch: Dispatch<BalancesAction>
}
