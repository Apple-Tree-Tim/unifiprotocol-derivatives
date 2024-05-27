import { useContext, useCallback } from 'react'
import { AdapterContext } from './AdapterProvider'
import { AdapterActions } from './Types'
import { NON_SUCCESS_RESPONSE } from 'Adapters/IAdapter'
import { ContractMethod } from 'Adapters/Contract'
import { LoadingContext } from 'Stores/Loading/LoadingProvider'
import { LoadingActions } from 'Stores/Loading/Types'
import { useTransactions } from 'Stores/Transactions/useTransactions'
import { Config } from '../../Config'
import TronLinkAdapter from '../../Adapters/TronLinkAdapter'

const Adapter: {
  [key: string]: () => Promise<{
    default: typeof TronLinkAdapter
  }>
} = {
  tron: () => import('../../Adapters/TronLinkAdapter'),
}

export const useAdapter = () => {
  const {
    state: { adapter, isConnectionReady },
    dispatch
  } = useContext(AdapterContext)
  const { dispatch: loadingDispatcher } = useContext(LoadingContext)
  const { addTransaction } = useTransactions()

  const connect = async () => {
    const AdapterBuilder = await Adapter[
      Config.blockchain as keyof typeof Adapter
    ]().then(({ default: adpt }) => {
      return adpt
    })

    const adapterInstance = new AdapterBuilder()
    adapterInstance.onConnect(() => {
      dispatch({
        type: AdapterActions.SET_ADAPTER,
        payload: {
          adapter: adapterInstance,
          isConnectionReady: adapterInstance.isConnected()
        }
      })
    })
    return adapterInstance.connect()
  }

  const execute = useCallback(
    async (
      contractName: string,
      method: ContractMethod,
      values: {
        args?: Array<string | number | undefined>
        callValue?: string | number | undefined
      } = {},
      isWrite = false
    ) => {
      try {
        loadingDispatcher({ type: LoadingActions.START_LOADING })
        if (adapter) {
          const reducedValues = {
            args: [],
            callValue: 0,
            ...values
          }
          const res = await adapter.execute(
            contractName,
            method,
            reducedValues,
            isWrite
          )

          addTransaction(res)
          return res
        }
        return { ...NON_SUCCESS_RESPONSE, functionName: method, params: values }
      } catch (err) {
        console.error('useAdapter -> err', err)
        return { ...NON_SUCCESS_RESPONSE, functionName: method, params: values }
      } finally {
        loadingDispatcher({ type: LoadingActions.FINISH_LOADING })
      }
    },
    [adapter, loadingDispatcher, addTransaction]
  )

  return {
    connect,
    execute,
    adapter,
    isConnectionReady
  }
}
