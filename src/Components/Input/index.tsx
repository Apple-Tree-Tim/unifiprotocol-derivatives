import React, { useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'
import { isNumber, BigNumber as BN } from 'Utils/BigNumber'
import Button from 'Components/Button'
import { useTranslation } from 'react-i18next'

import './Input.scss'

const Input: React.FC<{
  placeholder?: string
  onChange?: (value: string) => void
  balance?: string
  onlyNumbers?: boolean
  value?: string
  max?: boolean
  disabled?: boolean
  decimals?: number
  exactMax?: boolean
}> = ({
  onChange,
  placeholder,
  balance,
  onlyNumbers,
  value,
  max,
  disabled,
  exactMax
}) => {
  const { addToast } = useToasts()
  const { t } = useTranslation()

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onlyNumbers && !isNumber(value) && value !== '') {
      addToast(
        <div>
          <div>{t('input.invalid-amount-typed-1')}</div>
          <div>{t('input.invalid-amount-typed-2')}</div>
        </div>,
        {
          appearance: 'warning'
        }
      )
    }
    onChange && onChange(value)
  }

  const onMaxclick = useCallback(() => {
    if (max && balance && BN(balance).isGreaterThan(0)) {
      onChange &&
        onChange(
          BN(balance)
            .multipliedBy(exactMax ? 0.9999 : 0.9998)
            .toFixed()
        )
    }
  }, [balance, max, onChange, exactMax])

  return (
    <div className="Input-Container">
      {balance !== undefined && (
        <div className="Input-Container__balance">
          {t('input.balance')}: {balance}
        </div>
      )}
      <div className="Input-Container__wrapper">
        <input
          type="text"
          className="Input"
          placeholder={placeholder}
          onChange={(e) => onChangeHandler(e)}
          value={value}
          disabled={disabled}
        />
        {balance !== undefined && max !== undefined && (
          <span className="Input-Container__wrapper__max">
            <Button onClick={onMaxclick}>{t('input.max')}</Button>
          </span>
        )}
      </div>
    </div>
  )
}

export default Input
