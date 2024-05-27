import React, { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Button from '../Button'
import { useAdapter } from 'Stores/Adapter/useAdapter'
import { ReactComponent as UnifiLogo } from 'Assets/unifi-logo.svg'
import { useToasts } from 'react-toast-notifications'
import { Config } from 'Config'
import { useTranslation } from 'react-i18next'

import './Header.scss'

const BlockchainAddon: { [key: string]: string } = {
  harmony: 'OneWallet',
  ontology: 'CyanoWallet',
  tron: 'TronLink'
}

const Header = () => {
  const history = useHistory()
  const location = useLocation()
  const { adapter, isConnectionReady } = useAdapter()
  const { addToast } = useToasts()
  const { t } = useTranslation()

  const addressExplorerLink = useMemo(() => {
    if (adapter) {
      return Config.accountExplorer.replace('{{ADDRESS}}', adapter.getAddress())
    }
    return ''
  }, [adapter])

  const onClickConnectionButton = useCallback(() => {
    if (!isConnectionReady) {
      addToast(
        <div>
          {t('header.wallet-toast', {
            wallet: BlockchainAddon[Config.blockchain]
          })}
        </div>,
        {
          appearance: 'info'
        }
      )
    }
  }, [addToast, isConnectionReady, t])

  return (
    <div className="Header">
      <span className="Header__logo" onClick={() => history.push('/')}>
        <UnifiLogo />
      </span>
      <span className="Header__nav">
        <div
          className={location.pathname.match(/^\/$/) ? 'active' : 'no-active'}
        >
          <Button white onClick={() => history.push('/')} icon="SwapCalls">
            {t('header.section.trade')}
          </Button>
        </div>
        <div
          className={
            location.pathname.match(/^\/liquidity/) ? 'active' : 'no-active'
          }
        >
          <Button
            white
            onClick={() => history.push('/liquidity')}
            icon="Plumber"
          >
            {t('header.section.liquidity')}
          </Button>
        </div>
      </span>
      <div className="Header__connection">
        <Button purple={isConnectionReady} onClick={onClickConnectionButton}>
          {isConnectionReady ? (
            <a
              className="anchor-wallet"
              href={addressExplorerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {adapter?.getAddress()}
            </a>
          ) : (
            t('header.wallet')
          )}
        </Button>
      </div>
    </div>
  )
}

export default Header
