import { useContext, useMemo } from 'react'
import { BigNumber } from '../../Utils/BigNumber'
import { ConfigContext } from './ConfigProvider'
import { ConfigActions } from './Types'

const ONE_HOUR_MS = 1000 * 60 * 60

export const useConfig = () => {
  const {
    state: { warning },
    dispatch
  } = useContext(ConfigContext)

  const isAgreementAccepted = useMemo(() => {
    if (warning.lastConfirmation === 0) return false
    return BigNumber(warning.lastConfirmation)
      .plus(ONE_HOUR_MS)
      .isGreaterThan(Date.now())
  }, [warning])

  const acceptAgreement = () => {
    dispatch({
      type: ConfigActions.SET_WARNING
    })
  }

  return { acceptAgreement, isAgreementAccepted }
}
