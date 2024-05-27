import { Dispatch } from 'react'

export type Pool = {
  name: string
  againstToken: string
  price: string
  contractAddress: string
  liquidityA: string
  liquidityB: string
  volume: string
  isDerivative: boolean
}

export type Pair = {
  name: string
  contract_address: string
  decimals: number
  is_derivative: boolean
  token_a: string
  token_a_address: string
  token_a_decimals: number
  token_b: string
  token_b_address: string
  token_b_decimals: number
}

export type Contract = {
  address: string
  decimals: number
}

export type PoolsState = {
  pools: Pool[]
  pairs: Pair[]
  contracts: { [token: string]: Contract }
}

export enum PoolsActions {
  ADD_POOL = 'ADD_POOL',
  ADD_PAIR = 'ADD_PAIR',
  ADD_CONTRACT = 'ADD_CONTRACT',
  CLEAR = 'CLEAR'
}

export type PoolsAction = {
  type: PoolsActions
  payload?: Partial<PoolsState>
}

export type PoolsReducer = (
  state: PoolsState,
  action: PoolsAction
) => PoolsState

export type PoolsContextState = {
  state: PoolsState
  dispatch: Dispatch<PoolsAction>
}
