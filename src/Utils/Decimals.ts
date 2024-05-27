import { Config } from 'Config'

const powerDictionary: {
  [key: string]: { precision: number; decimals: number }
} = {}

;(() => {
  const index: {
    [key: string]: { precision: number; decimals: number }
  } = powerDictionary

  Config.pairs.forEach((contract) => {
    index[contract.contractAddress] = {
      precision: Math.pow(10, contract.decimals),
      decimals: contract.decimals
    }
    index[contract.token] = {
      precision: Math.pow(10, contract.decimals),
      decimals: contract.decimals
    }
  })

  Object.keys(Config.contracts).forEach((tkn) => {
    const token = tkn as keyof typeof Config.contracts
    const { address, decimals } = Config.contracts[token]
    index[token] = {
      precision: Math.pow(10, decimals),
      decimals: decimals
    }
    index[address] = {
      precision: Math.pow(10, decimals),
      decimals: decimals
    }
  })
})()

export const getPrecision = (tokenOrContract: string) => {
  return powerDictionary[tokenOrContract]
    ? powerDictionary[tokenOrContract]['precision']
    : Config.globalPrecision
}

export const getDecimals = (tokenOrContract: string) => {
  return powerDictionary[tokenOrContract]
    ? powerDictionary[tokenOrContract]['decimals']
    : Config.globalPowerPrecision
}
