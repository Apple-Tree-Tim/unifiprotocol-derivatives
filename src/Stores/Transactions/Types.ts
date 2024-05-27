import { Dispatch } from 'react'
import { ExecutionResponse } from '../../Adapters/IAdapter'

type TokenMovement = {
  name: string
  value: string | number
}

export enum MovementTypes {
  SENT = 'sent',
  RECEIVED = 'received',
  DEPOSITED = 'deposited',
  WITHDRAWN = 'withdrawn'
}

export type ExpectedTransaction = {
  transaction: ExecutionResponse
  movements: {
    [MovementTypes.DEPOSITED]?: TokenMovement[]
    [MovementTypes.WITHDRAWN]?: TokenMovement[]
    [MovementTypes.RECEIVED]?: TokenMovement
    [MovementTypes.SENT]?: TokenMovement
  }
}

export type TransactionsState = {
  transactions: ExecutionResponse[]
  expectedTransactions: ExpectedTransaction[]
}

export enum TransactionsActions {
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  ADD_EXPECTED_TRANSACTION = 'ADD_EXPECTED_TRANSACTION'
}

export type TransactionsAction = {
  type: TransactionsActions
  payload?: Partial<TransactionsState>
}

export type TransactionsReducer = (
  state: TransactionsState,
  action: TransactionsAction
) => TransactionsState

export type TransactionsContextState = {
  state: TransactionsState
  dispatch: Dispatch<TransactionsAction>
}
