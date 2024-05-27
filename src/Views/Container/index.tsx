import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { Route } from 'react-router-dom'
import Header from 'Components/Header'
import { Swap } from 'Views/Swap'
import { Liquidity } from 'Views/Liquidity'
import { SwapSuccessful } from 'Views/SwapSuccessful'
import { Pool } from 'Views/Pool'
import { PoolJoin } from 'Views/PoolJoin'
import { DepositSuccessful } from 'Views/DepositSuccessful'
import { RemovePool } from 'Views/RemovePool'
import { RemovePoolSuccessful } from 'Views/RemovePoolSuccessful'
import { RedeemPool } from 'Views/RedeemPool'
import { Failed } from 'Views/Failed'
import Loading from 'Components/Loading'
import { Warning } from '../Warning'
import { ClaimRewards } from '../ClaimRewards'
import { ClaimSuccessful } from '../ClaimSuccessful'
import withWarning from '../../Components/WarningWrapper'

import './Container.scss'

const successRoutes = [
  {
    path: '/liquidity/remove-pool/:contractAddress/success',
    Component: RemovePoolSuccessful
  },
  {
    path: '/liquidity/remove-pool/:contractAddress/success/:txHash',
    Component: RemovePoolSuccessful
  },
  {
    path: '/liquidity/pool/join/:contractAddress/success',
    Component: DepositSuccessful
  },
  {
    path: '/liquidity/pool/join/:contractAddress/success/:txHash',
    Component: DepositSuccessful
  },
  { path: '/trade/success', Component: SwapSuccessful },
  { path: '/trade/success/:txHash', Component: SwapSuccessful },
  { path: '/liquidity/claim-rewards/success', Component: ClaimSuccessful },
  {
    path: '/liquidity/claim-rewards/success/:txHash',
    Component: ClaimSuccessful
  }
]

const routes = [
  { path: '/', Component: withWarning(Swap) },
  { path: '/warning', Component: Warning },
  { path: '/trade', Component: withWarning(Swap) },
  { path: '/liquidity', Component: withWarning(Liquidity) },
  { path: '/liquidity/claim-rewards', Component: ClaimRewards },
  { path: '/liquidity/pool', Component: withWarning(Pool) },
  {
    path: '/liquidity/pool/join/:contractAddress',
    Component: withWarning(PoolJoin)
  },
  { path: '/liquidity/remove-pool', Component: withWarning(RemovePool) },
  {
    path: '/liquidity/remove-pool/:contractAddress',
    Component: withWarning(RedeemPool)
  },
  { path: '/failed', Component: Failed },
  ...successRoutes
]

const Container: React.FC = () => {
  return (
    <div className="Container">
      <Loading />
      <div className="Container__content">
        <div className="Container__content__nav">
          <Header />
        </div>
        <div className="Container__content__wrapper Wrapper">
          {routes.map(({ path, Component }) => (
            <Route path={path} exact key={path}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="slide"
                  unmountOnExit
                >
                  <Component />
                </CSSTransition>
              )}
            </Route>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Container
