import React from 'react'
import { useConfig } from '../../Stores/Config/useConfig'
import { Warning } from '../../Views/Warning'

const withWarning = (Wrapped: React.FC<any>) => () => {
  const { isAgreementAccepted } = useConfig()
  return isAgreementAccepted ? <Wrapped /> : <Warning />
}

export default withWarning
