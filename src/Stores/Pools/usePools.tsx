import { useContext, useCallback } from 'react'
import { PoolsContext } from './PoolsProvider'
import { PoolsActions, Pool, Pair, Contract } from './Types'
import { useAPI } from 'Stores/API/useAPI'

export const usePools = () => {
  const {
    state: { pools, pairs, contracts },
    dispatch
  } = useContext(PoolsContext)
  const { getPoolsData, getPairsData } = useAPI()

  const addPool = useCallback(
    (pool: Pool) => {
      dispatch({
        type: PoolsActions.ADD_POOL,
        payload: { pools: [pool] }
      })
    },
    [dispatch]
  )

  const addPair = useCallback(
    (pair: Pair) => {
      dispatch({
        type: PoolsActions.ADD_PAIR,
        payload: { pairs: [pair] }
      })
    },
    [dispatch]
  )

  const addContract = useCallback(
    (contract: { [token: string]: Contract }) => {
      dispatch({
        type: PoolsActions.ADD_CONTRACT,
        payload: { contracts: contract }
      })
    },
    [dispatch]
  )

  const clearPools = useCallback(() => {
    dispatch({
      type: PoolsActions.CLEAR
    })
  }, [dispatch])

  const updatePools = useCallback(async () => {
    getPoolsData({ onlyDerivatives: true }).then((pools) => {
      clearPools()
      pools.forEach(addPool)
    })
  }, [getPoolsData, addPool, clearPools])

  const updatePairs = useCallback(async () => {
    getPairsData().then(({ pairs, contracts }) => {
      pairs.forEach(addPair)
      addContract(contracts)
    })
  }, [getPairsData, addPair, addContract])

  return {
    updatePairs,
    updatePools,
    pools,
    pairs,
    contracts
  }
}
