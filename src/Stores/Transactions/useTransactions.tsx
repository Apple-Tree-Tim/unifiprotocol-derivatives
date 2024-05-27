import { useContext, useCallback } from 'react'
import { TransactionsContext } from './TransactionsProvider'
import { ExpectedTransaction, TransactionsActions } from './Types'
import { ExecutionResponse } from '../../Adapters/IAdapter'
import { Config } from 'Config'

export const useTransactions = () => {
  const {
    state: { transactions, expectedTransactions },
    dispatch
  } = useContext(TransactionsContext)

  const addTransaction = useCallback(
    (transaction: ExecutionResponse) => {
      dispatch({
        type: TransactionsActions.ADD_TRANSACTION,
        payload: { transactions: [transaction] }
      })
    },
    [dispatch]
  )

  const addExpectedTransaction = useCallback(
    (expectedTransaction: ExpectedTransaction) => {
      dispatch({
        type: TransactionsActions.ADD_EXPECTED_TRANSACTION,
        payload: { expectedTransactions: [expectedTransaction] }
      })
    },
    [dispatch]
  )

  const getExpectedTransactionByHash = useCallback(
    (txHash: string) =>
      expectedTransactions.find((t) => {
        return t.transaction.hash === txHash
      }),
    [expectedTransactions]
  )

  const getExplorerLink = useCallback((txHash: string) => {
    return Config.transactionExplorer.replace('{{TRANSACTION_HASH}}', txHash)
  }, [])

  return {
    addTransaction,
    addExpectedTransaction,
    getExpectedTransactionByHash,
    getExplorerLink,
    transactions,
    expectedTransactions
  }
}
