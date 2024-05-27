export default {
  tron: {
    blockchain: 'tron',
    blockchainToken: 'TRX',
    transactionExplorer:
      'https://tronscan.org/#/transaction/{{TRANSACTION_HASH}}',
    accountExplorer: 'https://tronscan.org/#/address/{{ADDRESS}}',
    pairs: [
      {
        name: 'uSEED',
        scriptHash: '',
        contractAddress: 'TF98sp4A67C48Vq7EZrgnPtjexdEYiNagG',
        token: 'uuSEED',
        tokenAddress: 'TMFvnLMR1r1awHVGZsciwP4e3PVD7eiMWe',
        againstToken: 'TRX',
        againstTokenAddress: 'TRX',
        decimals: 6
      },
      {
        name: 'uUP',
        scriptHash: '',
        contractAddress: 'TLPVk1Hd6ycygwtNuQPKVWf5KxXjPTaLaS',
        token: 'uuUP',
        tokenAddress: 'TUxqQp2qXUx7hT2F6Zx4hy85n8o9L9bzM9',
        againstToken: 'TRX',
        againstTokenAddress: 'TRX',
        decimals: 6
      },
      {
        name: 'uJST',
        scriptHash: '',
        contractAddress: 'TLNqRRUgDfNKnQe7jDpYizQTFc7ZuneZmM',
        token: 'uuJST',
        tokenAddress: 'TStFJsoAcXXpn9rW7Q9VUhRE1D2pQV5oEN',
        againstToken: 'TRX',
        againstTokenAddress: 'TRX',
        decimals: 18
      },
      {
        name: 'uSUN',
        scriptHash: '',
        contractAddress: 'TX3bH2qFbcjt6P85ycZumZjZDEDyy2sd5D',
        token: 'uuSUN',
        tokenAddress: 'TCFkPBue2PJC4DYm3pcf2n8zS4BoS7HX5t',
        againstToken: 'TRX',
        againstTokenAddress: 'TRX',
        decimals: 18
      },
      {
        name: 'uUSDJ',
        scriptHash: '',
        contractAddress: 'TAoVb1uwocujw3bMNj2azFad3ZQXJJLTJF',
        token: 'uuUSDJ',
        tokenAddress: 'TAHRToWQxwWiAA8eG96ZXk6AZAFf1fWRhd',
        againstToken: 'TRX',
        againstTokenAddress: 'TRX',
        decimals: 18
      },
      {
        name: 'uUSDT',
        scriptHash: '',
        contractAddress: 'TFsewwdbyGSyQcqbxKbG9xLx8wMWathpBz',
        token: 'uuUSDT',
        tokenAddress: 'TYmbq6sGxEe2VkhpSpvfiw5f8ir5HxpAun',
        againstToken: 'TRX',
        againstTokenAddress: 'TRX',
        decimals: 6
      }
    ],
    contracts: {
      UP: {
        address: 'TJ93jQZibdB3sriHYb5nNwjgkPPAcFR7ty',
        decimals: 6
      },
      TRX: {
        address: 'TRX',
        decimals: 6
      },
      uSEED: {
        address: 'TMFvnLMR1r1awHVGZsciwP4e3PVD7eiMWe',
        decimals: 6
      },
      uUP: {
        address: 'TUxqQp2qXUx7hT2F6Zx4hy85n8o9L9bzM9',
        decimals: 6
      },
      uJST: {
        address: 'TStFJsoAcXXpn9rW7Q9VUhRE1D2pQV5oEN',
        decimals: 18
      },
      uSUN: {
        address: 'TCFkPBue2PJC4DYm3pcf2n8zS4BoS7HX5t',
        decimals: 18
      },
      uUSDJ: {
        address: 'TAHRToWQxwWiAA8eG96ZXk6AZAFf1fWRhd',
        decimals: 18
      },
      uUSDT: {
        address: 'TYmbq6sGxEe2VkhpSpvfiw5f8ir5HxpAun',
        decimals: 6
      }
    },
    globalPrecision: 1000000,
    globalPowerPrecision: 6,
    percentagePrecision: 100000
  }
}
