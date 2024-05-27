import React from 'react'
import BlockchainConfigs from './unifi-config'
import { Icon } from 'Components/Icon'

const BLOCKCHAIN_TARGET =
  (process.env.REACT_APP_BLOCKCHAIN as keyof typeof BlockchainConfigs) || 'tron'

const BlockchainConfig = BlockchainConfigs[BLOCKCHAIN_TARGET]

const Config = { ...BlockchainConfig, numberLocale: 'en-US' }

const Pairs = (() => {
  const basePairs = Array.from(new Set(Config.pairs.map((x) => x.name))).map(
    (p) => ({
      label: (
        <>
          <Icon icon={p} /> {p}
        </>
      ),
      value: p
    })
  )
  const againstPairs = Array.from(
    new Set(Config.pairs.map((x) => x.againstToken))
  ).map((p) => ({
    label: (
      <>
        <Icon icon={p} /> {p}
      </>
    ),
    value: p
  }))
  return [...againstPairs, ...basePairs]
})()

export { Config, Pairs }
