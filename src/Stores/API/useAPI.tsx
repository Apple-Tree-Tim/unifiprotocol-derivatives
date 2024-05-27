import { Config } from 'Config'
import { Contract, Pair, Pool } from 'Stores/Pools/Types'
import { fetchJSON } from 'Utils/Fetch'

const isAlpha = /alpha/.test(window.location.href)
const BASE_ENDPOINT = `https://${
  isAlpha ? 'alpha' : Config.blockchain
}.unifiprotocol.com/api/v1`
const alphaTail = `&${isAlpha ? 'alpha=true' : ''}`

export const useAPI = () => {
  const getContractVolume = async (contract: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        contract,
        blockchain: Config.blockchain,
        network: 'mainnet'
      })
    }
    const { volume } = await fetchJSON<{ volume: string }>(
      `${BASE_ENDPOINT}/events/volume`,
      options
    )

    return volume
  }

  const getPoolsData = async ({
    onlyDerivatives
  }: {
    onlyDerivatives: boolean
  }): Promise<Pool[]> => {
    const pools = await fetchJSON<Pool[]>(
      `${BASE_ENDPOINT}/pools/${Config.blockchain}?derivatives=${
        onlyDerivatives || false
      }${alphaTail}`,
      {}
    )

    return pools
  }

  const getPairsData = async (): Promise<{
    pairs: Pair[]
    contracts: { [token: string]: Contract }
  }> => {
    const pairsResponse = await fetchJSON<{
      pairs: Pair[]
      contracts: { [token: string]: Contract }
    }>(
      `${BASE_ENDPOINT}/pairs/${Config.blockchain}?derivatives=true${alphaTail}`,
      {}
    )
    return pairsResponse
  }

  return {
    getPoolsData,
    getPairsData,
    getContractVolume
  }
}
