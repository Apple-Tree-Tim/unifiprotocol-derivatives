import { IAdapter, AdapterBalance, NON_SUCCESS_RESPONSE } from './IAdapter'
import { Config } from 'Config'
import { ContractMethod } from './Contract'
import { BigNumber } from 'bignumber.js'
import { AxiosConcurrencyHandler } from 'Utils/AxiosConcurrencyHandler'
import { getPrecision } from 'Utils/Decimals'
import { Emitter, EmitterAction } from '../Utils/EventEmitter'

declare global {
  interface Window {
    tronWeb: any
  }
}

export default class TronLinkAdapter implements IAdapter {
  private tronWeb: any
  private onConnectCallback = () => {}
  private connectInterval: NodeJS.Timer | undefined
  private contracts: { [nameContract: string]: any } = {}

  isConnected() {
    return this.getAddress() !== undefined && this.tronWeb !== undefined
  }

  getAddress(): string {
    return window.tronWeb.defaultAddress.base58 || ''
  }

  async getBalances() {
    try {
      const TRX = await this.getTrxBalance()
      Emitter.emit(EmitterAction.BALANCE, [TRX])

      const balances = []
      for (const pair of Config.pairs) {
        const [token, uToken] = await Promise.all([
          this.getBalanceOf(pair.tokenAddress),
          this.getBalanceOf(pair.contractAddress)
        ])
        balances.push(token, uToken)

        Emitter.emit(EmitterAction.BALANCE, [token, uToken])
      }

      return [TRX, ...balances]
    } catch (err) {
      return []
    }
  }

  async connect(): Promise<TronLinkAdapter> {
    return new Promise(async (resolve) => {
      const performConnection = async () => {
        try {
          if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            clearInterval(this.connectInterval!)
            this.tronWeb = window.tronWeb
            const axiosHandler = new AxiosConcurrencyHandler(
              this.tronWeb.fullNode.instance
            )
            axiosHandler.setInterceptors()
            await this.initializeContracts()
            this.onConnectCallback()
            resolve(this)
            return true
          }
          return false
        } catch (e) {
          return false
        }
      }

      const conn = await performConnection()

      if (!conn) {
        this.connectInterval = setInterval(async () => {
          performConnection()
        }, 1000)
      }
    })
  }

  onConnect(cb: () => void) {
    this.onConnectCallback = cb
  }

  async execute(
    contractName: string,
    method: ContractMethod,
    params: {
      args: Array<string | number | undefined>
      callValue: string | number | undefined
    },
    isWrite = false
  ) {
    try {
      const contract = this.contracts[contractName]
      const { args, callValue } = params

      if (isWrite) {
        const contractCall = await contract[method].apply(null, args).send({
          feeLimit: 100_000_000,
          callValue: callValue || 0,
          shouldPollResponse: false,
          keepTxID: true
        })

        if (contractCall) {
          // const [hash, value] = contractCall
          return {
            success: true,
            value: '',
            hash: contractCall,
            functionName: method,
            params
          }
        }
      } else {
        const contractCall = await contract[method].apply(null, args).call()
        if (contractCall) {
          const value = contractCall.toString()
          return {
            success: true,
            value,
            hash: '',
            functionName: method,
            params
          }
        }
      }
      return { ...NON_SUCCESS_RESPONSE, functionName: method, params }
    } catch (err) {
      console.error('TronLinkAdapter -> execute -> err', err, method, params)
      return { ...NON_SUCCESS_RESPONSE, functionName: method, params }
    }
  }

  private async initializeContracts() {
    const contracts: string[] = []

    Object.entries(Config.contracts).forEach(([, { address }]) => {
      if (address !== 'TRX') {
        contracts.push(address)
      }
    })

    Config.pairs.forEach(({ contractAddress }) => {
      if (contractAddress !== 'TRX') {
        contracts.push(contractAddress)
      }
    })

    const contractInstances = await Promise.all(
      contracts.map((c) =>
        this.tronWeb
          .contract()
          .at(c)
          .then((ins: any) => ({ contract: c, instance: ins }))
      )
    )

    contractInstances.forEach(({ contract, instance }) => {
      this.contracts = {
        ...this.contracts,
        [contract]: instance
      }
    })
  }

  private async getTrxBalance(
    targetAddress: string = this.getAddress()
  ): Promise<AdapterBalance> {
    if (!this.isConnected()) {
      return { name: 'TRX', balance: '0' }
    }
    const balanceOf = await this.tronWeb.trx.getBalance(targetAddress)

    const balance = new BigNumber(balanceOf.toString())
      .dividedBy(Config.globalPrecision)
      .toFixed()

    return { name: 'TRX', balance }
  }

  async getBalanceOf(
    contractAddress: string,
    targetAddress: string = this.getAddress()
  ) {
    if (!this.isConnected()) {
      return { name: contractAddress, balance: '0' }
    }

    if (contractAddress === 'TRX') {
      return this.getTrxBalance(targetAddress)
    }

    const balanceOf = await this.contracts[contractAddress]
      .balanceOf(targetAddress)
      .call()

    const balanceBN = 'balance' in balanceOf ? balanceOf.balance : balanceOf

    const balance = new BigNumber(balanceBN.toString())
      .dividedBy(getPrecision(contractAddress))
      .toFixed()
    return { name: contractAddress, balance }
  }
}
