import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAdapter } from './useAdapter'
import { ContractMethod } from '../../Adapters/Contract'
import { Config } from 'Config'
import { getPrecision } from 'Utils/Decimals'
import { toHex } from 'Utils/BigNumber'

export const useContract = (contractAddress: string | undefined) => {
  const { execute, adapter } = useAdapter()

  const contractDetail = useMemo(
    () => Config.pairs.find((p) => p.contractAddress === contractAddress),
    [contractAddress]
  )

  const getAllowance = useCallback(async () => {
    if (adapter && contractDetail && contractAddress) {
      const allowanceResponse = await execute(
        contractDetail.tokenAddress,
        ContractMethod.ALLOWANCE,
        { args: [adapter.getAddress(), contractAddress] }
      )

      return new BigNumber(allowanceResponse.value).toNumber()
    }
    return 0
  }, [execute, adapter, contractAddress, contractDetail])

  const approveAllowance = useCallback(
    async (amount: string | number) => {
      if (adapter && contractDetail && contractAddress) {
        const num = toHex(Math.trunc(new BigNumber(amount).toNumber()))
        const approveResponse = await execute(
          contractDetail.tokenAddress,
          ContractMethod.APPROVE,
          { args: [contractAddress, num] },
          true
        )
        return approveResponse
      }
      return false
    },
    [adapter, execute, contractAddress, contractDetail]
  )

  const deposit = useCallback(
    async (amount: string | number) => {
      if (adapter && contractDetail && contractAddress) {
        const num = toHex(Math.trunc(new BigNumber(amount).toNumber()))
        const depositResponse = await execute(
          contractAddress,
          ContractMethod.DEPOSIT_SUPPLY,
          { callValue: num },
          true
        )

        return depositResponse
      }
      return false
    },
    [adapter, execute, contractAddress, contractDetail]
  )

  const withdraw = useCallback(
    async (amount: string | number) => {
      if (adapter && contractDetail && contractAddress) {
        const num = toHex(Math.trunc(new BigNumber(amount).toNumber()))
        const withdrawResponse = await execute(
          contractAddress,
          ContractMethod.WITHDRAW_SUPPLY,
          { args: [num] },
          true
        )

        return withdrawResponse
      }
      return false
    },
    [adapter, execute, contractAddress, contractDetail]
  )

  const sell = useCallback(
    async (amount: string | number) => {
      if (adapter && contractDetail && contractAddress) {
        const num = toHex(
          Math.trunc(
            new BigNumber(amount)
              .multipliedBy(getPrecision(contractDetail.name))
              .toNumber()
          )
        )
        const depositResponse = await execute(
          contractAddress,
          ContractMethod.SELL,
          { args: [num] },
          true
        )
        return depositResponse
      }
      return false
    },
    [adapter, execute, contractAddress, contractDetail]
  )

  const buy = useCallback(
    async (amount: string | number) => {
      if (adapter && contractDetail && contractAddress) {
        const num = toHex(
          Math.trunc(
            new BigNumber(amount)
              .multipliedBy(getPrecision(contractDetail.againstToken))
              .toNumber()
          )
        )
        const depositResponse = await execute(
          contractAddress,
          ContractMethod.BUY,
          { args: [adapter.getAddress()], callValue: num },
          true
        )

        return depositResponse
      }
      return false
    },
    [adapter, execute, contractAddress, contractDetail]
  )

  return {
    getAllowance,
    approveAllowance,
    deposit,
    withdraw,
    buy,
    sell
  }
}
