import React from 'react'
import { Table, TableRow } from '../Table'
import { ArrowForwardIos } from '@material-ui/icons'
import { SwapState } from 'Stores/Swap/useSwap'
import { Icon } from 'Components/Icon'
import { Config } from 'Config'
import { localiseNumber, truncateDecimals } from 'Utils/BigNumber'

import './SwapDetail.scss'

type SwapDetailProps = Pick<SwapState, 'tokenA' | 'tokenB'> & {
  maxTransaction: string
  selectedPair: typeof Config.pairs[number] | undefined
  tradeFee: string
  price: string
  slippage: string
}

const SwapDetail: React.FC<SwapDetailProps> = ({
  tokenA,
  tokenB,
  maxTransaction,
  selectedPair,
  tradeFee,
  price,
  slippage
}) => {
  if (selectedPair) {
    return (
      <span className="Swap-Detail">
        <div className="Swap-Detail__summary">
          <Table>
            <TableRow
              columns={[
                'Price',
                <div className="text-align-right">
                  {price} {tokenB} per {tokenA}
                </div>
              ]}
            />
            <TableRow
              columns={[
                'Max Trade Size',
                <div className="text-align-right">
                  {localiseNumber(truncateDecimals(maxTransaction))} {tokenA}
                </div>
              ]}
            />
            <TableRow
              columns={[
                'Trade fee',
                <div className="text-align-right">
                  {truncateDecimals(tradeFee)} {Config.blockchainToken}
                </div>
              ]}
            />
            <TableRow
              columns={[
                'Slippage',
                <div className="text-align-right slippage">{slippage} %</div>
              ]}
            />
          </Table>
        </div>
        <div className="Swap-Detail__sequence">
          <div>Transaction Sequence</div>
          <div className="Swap-Detail__sequence__detail">
            <div>
              <span className="token-logo">
                <Icon icon={tokenA} />
              </span>
              <span className="token">
                <span className="token__flow">From</span>
                <h2>{tokenA}</h2>
              </span>
            </div>
            <span className="arrow">
              <ArrowForwardIos />
            </span>
            <div>
              <span className="token-logo">
                <Icon icon={tokenB} />
              </span>
              <span className="token">
                <span className="token__flow">To</span>
                <h2>{tokenB}</h2>
              </span>
            </div>
          </div>
        </div>
      </span>
    )
  }

  return (
    <span className="SwapDetail-message">
      Please select the tokens to trade
    </span>
  )
}

export default SwapDetail
