import React from 'react'
import { Table, TableRow, TableHeader } from 'Components/Table'
import Button from 'Components/Button'
import { useHistory } from 'react-router-dom'
import BottomButton from 'Components/BottomButton'
import UnbrandedUnifi from 'Assets/unifi-logo-unbranded.png'
import { Config } from 'Config'
import { useBalances } from 'Stores/Balances/useBalances'
import { Trans, useTranslation } from 'react-i18next'

import './RemovePool.scss'

const RemovePool: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { getBalanceByToken } = useBalances()

  return (
    <div className="RemovePool">
      <div className="RemovePool__header">
        <img src={UnbrandedUnifi} alt="Unifi" />
        <span>
          <h1>{t('liquidity.remove-pool.title')}</h1>
          <p>{t('liquidity.remove-pool.p-1')}</p>
          <p>{t('liquidity.remove-pool.p-2')}</p>
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

      <div className="RemovePool__table">
        <Table>
          <TableHeader
            columns={[
              t('liquidity.remove-pool.table.tokens'),
              t('liquidity.remove-pool.table.balance'),
              ''
            ]}
          />
          {Config.pairs.map((pairDetail, i) => (
            <TableRow
              key={i}
              columns={[
                `${pairDetail.token}`,
                `${getBalanceByToken(pairDetail.contractAddress)}`,
                <div className="column-right">
                  <Button
                    onClick={() =>
                      history.push(
                        `/liquidity/remove-pool/${pairDetail.contractAddress}`
                      )
                    }
                  >
                    {t('liquidity.remove-pool.table.redeem')}
                  </Button>
                </div>
              ]}
            />
          ))}
        </Table>
      </div>

      <div className="Wrapper-Bottom-Button">
        <RemovePoolButton />
      </div>
    </div>
  )
}

const RemovePoolButton = () => {
  const { t } = useTranslation()
  const history = useHistory()
  return (
    <BottomButton
      label={t('bottom-button-back.label')}
      onClick={() => history.push('/liquidity')}
    />
  )
}

export { RemovePool, RemovePoolButton }
