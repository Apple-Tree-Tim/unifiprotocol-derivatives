import React from 'react'
import {
  AddCircleOutline,
  RemoveCircleOutline,
  AccountBalanceOutlined
} from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { Icon } from 'Components/Icon'
import { useTranslation, Trans } from 'react-i18next'

import './Liquidity.scss'

const Liquidity: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <div className="Liquidity">
      <div className="Liquidity__header">
        <Icon icon="Plumber" />
        <span>
          <h1>{t('liquidity.title')}</h1>
          <p>{t('liquidity.p-1')}</p>
          <p>
            <Trans i18nKey="for-more-info-press-here">
              For more information press{' '}
              <a
                href="https://unifiprotocol.zendesk.com/hc/en-us"
                title="more information"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </Trans>
          </p>
        </span>
      </div>

      <div className="Liquidity__selectors">
        <span
          className="Liquidity__selectors__selector"
          onClick={() => history.push('/liquidity/pool')}
        >
          <div>
            <AddCircleOutline />
          </div>
          <div className="selector__title">{t('liquidity.join-pool')}</div>
        </span>
        <span
          className="Liquidity__selectors__selector"
          onClick={() => history.push('/liquidity/remove-pool')}
        >
          <div>
            <RemoveCircleOutline />
          </div>
          <div className="selector__title">
            {t('liquidity.withdraw-liquidity')}
          </div>
        </span>
        <span
          className="Liquidity__selectors__selector"
          onClick={() => history.push('/liquidity/claim-rewards')}
        >
          <div>
            <AccountBalanceOutlined />
          </div>
          <div className="selector__title">
            {t('liquidity.claim-up-rewards')}
          </div>
        </span>
      </div>
    </div>
  )
}

export { Liquidity }
