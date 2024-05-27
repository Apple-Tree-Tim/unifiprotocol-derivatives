import { Token } from 'Stores/Balances/Types'
import { ContractMethod } from './Contract'

type Balance = string

export type AdapterBalance = { name: string | Token; balance: Balance }

export type ExecutionResponse = {
  success: boolean
  functionName: ContractMethod
  value: string
  hash: string
  params: ExecutionValueProps
}

export type ExecutionValueProps = {
  args?: Array<string | number | undefined>
  callValue?: string | number | undefined
}

export interface IAdapter {
  isConnected(): boolean
  getAddress(): string
  getBalances(): Promise<AdapterBalance[]>

  connect(): Promise<IAdapter>

  onConnect(cb: () => void): void

  execute(
    contractName: string,
    method: ContractMethod,
    values: ExecutionValueProps,
    isWrite: boolean
  ): Promise<ExecutionResponse>

  getBalanceOf(
    contractAddress: string,
    targetAddress?: string
  ): Promise<AdapterBalance>
}

export const NON_SUCCESS_RESPONSE = { success: false, value: '', hash: '' }
