import React from 'react'
import { useHistory } from 'react-router-dom'
import { Table, TableRow, TableHeader } from 'Components/Table'
import Button from 'Components/Button'
import { Icon } from 'Components/Icon'
import BottomButton from 'Components/BottomButton'
import { localiseNumber } from 'Utils/BigNumber'
import { usePools } from 'Stores/Pools/usePools'
import { Trans, useTranslation } from 'react-i18next'

import './Pool.scss'

const Pool: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { pools } = usePools()

  return (
    <div className="Pool">
      <div className="Pool__header">
        <Icon icon="Plumber" />
        <span>
          <h1>{t('liquidity.pool.title')}</h1>
          <p>{t('liquidity.pool.p-1')}</p>
          <p>{t('liquidity.pool.p-2')}</p>
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

      <div className="Pool__table">
        <Table>
          <TableHeader
            columns={[
              t('liquidity.pool.table.token-pair'),
              t('liquidity.pool.table.token-base'),
              t('liquidity.pool.table.total-liquidity'),
              t('liquidity.pool.table.24h-volume'),
              ''
            ]}
          />
          {pools.map((pairDetail, i) => (
            <TableRow
              key={i}
              columns={[
                `${pairDetail.name} / ${pairDetail.againstToken}`,
                `${localiseNumber(pairDetail.price)} ${
                  pairDetail.againstToken
                }`,
                <div>
                  <div>
                    {localiseNumber(pairDetail.liquidityA)} {pairDetail.name}
                  </div>
                  <div>
                    {localiseNumber(pairDetail.liquidityB)}{' '}
                    {pairDetail.againstToken}
                  </div>
                </div>,
                `${
                  pairDetail.volume === '0'
                    ? '-'
                    : localiseNumber(pairDetail.volume)
                }`,
                <div className="column-right">
                  <Button
                    onClick={() =>
                      history.push(
                        `/liquidity/pool/join/${pairDetail.contractAddress}`
                      )
                    }
                  >
                    {t('liquidity.pool.table.join')}
                  </Button>
                </div>
              ]}
            />
          ))}
        </Table>
      </div>

      <div className="Wrapper-Bottom-Button">
        <PoolButton />
      </div>
    </div>
  )
}

const PoolButton = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <BottomButton
      label={t('bottom-button-back.label')}
      onClick={() => history.push('/liquidity')}
    />
  )
}

export { Pool }
