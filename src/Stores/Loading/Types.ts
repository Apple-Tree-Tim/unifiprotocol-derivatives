import { Dispatch } from 'react'

export type LoadingState = {
  loading: number
  totalRequests: number
}

export enum LoadingActions {
  START_LOADING = 'START_LOADING',
  FINISH_LOADING = 'FINISH_LOADING'
}

export type LoadingAction = {
  type: LoadingActions
  payload?: Partial<LoadingState>
}

export type LoadingReducer = (
  state: LoadingState,
  action: LoadingAction
) => LoadingState

export type LoadingContextState = {
  state: LoadingState
  dispatch: Dispatch<LoadingAction>
}
